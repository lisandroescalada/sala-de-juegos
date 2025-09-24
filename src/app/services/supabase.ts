import { Injectable, signal, WritableSignal } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  private supabase: SupabaseClient;
  private realtimeChannel: any = null;
  user = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.restoreSession();
    
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
    console.log('User: ',this.user())
  }

  async restoreSession() {
    const { data } = await this.supabase.auth.getSession();
    this.user.set(data.session?.user ?? null);
  }

  // Auth
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    console.log('signUp() - Error:', error);
    return data;
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('signIn() - Error:', error);

    return { user: data.user, session: data.session };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    console.log('signOut() - Error:', error);
    this.user.set(null);
  }

  // Tables
    async loadTable(table_name: string, items: WritableSignal<any[]>) {
    const { data, error } = await this.supabase.from(table_name).select('*').order('id', { ascending: true });
    if (error) throw error;
    console.log('Rows:', data)
    items.set(data);
  }

  async saveTable(data: Record<string, any>, table_name: string) {
    console.log(`Table: ${table_name}\nNew row: ${JSON.stringify(data)}`)
    const { error } = await this.supabase.from(table_name).insert([data]);
    if (error) throw error;
  }

  // RealTime
  async setupRealtime(table_name: string, items: WritableSignal<any[]>) {
    try {
      this.realtimeChannel = this.supabase
        .channel(`public:${table_name}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: table_name },
          (payload: any) => {
            const newRow = payload.new;
            if (newRow) {
              items.update((arr) => {
                const exists = arr.find(item => item.id === newRow.id);
                if (!exists) return [...arr, newRow].sort((a, b) => a.id - b.id);
                return arr;
              });
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.error('Realtime setup failed:', err);
    }
  }
}
