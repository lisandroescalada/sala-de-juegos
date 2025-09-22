import { Injectable, signal } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private supabase: SupabaseClient;
  private realtimeChannel: any = null;
  items = signal<any[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { user: data.user, session: data.session };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async loadTable(table_name: string) {
    const { data, error } = await this.supabase.from(table_name).select('*').order('id', { ascending: true });
    if (error) throw error;
    return data;
  }

  async saveTable(data: Record<string, any>, table_name: string) {
    const { error } = await this.supabase.from(table_name).insert([data]);
    if (error) throw error;
  }

  async setupRealtime(table_name: string) {
    try {
      this.items.set(await this.loadTable(table_name));

      this.realtimeChannel = this.supabase
        .channel(`public:${table_name}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: table_name },
          (payload: any) => {
            const newRow = payload.new;
            if (newRow) {
              this.items.update((arr) => {
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
