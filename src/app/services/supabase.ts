import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  supabase: SupabaseClient;
  user = signal<User | null>(null);
  messages = signal<any[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.getCurrentUser();
    this.onAuthStateChange();
  }

  async getCurrentUser() {
    try {
      const { data } = await this.supabase.auth.getUser();
      this.user.set(data?.user ?? null);
    } catch (e: any) {
      console.log('getUser error', e);
    }
  }

  onAuthStateChange() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) return error;
    this.user.set(data?.user ?? null);
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Si el error indica que el usuario no confirmó el mail
      if (
        error.message.toLowerCase().includes('not confirmed') ||
        error.message.toLowerCase().includes('confirm') ||
        error.code === 'email_not_confirmed'
      ) {
        throw new Error('Tu correo no está confirmado. Revisá tu bandeja o carpeta de spam.');
      }

      // Otros errores (credenciales, red, etc.)
      throw error;
    }

    // Si todo ok, guardás el usuario
    this.user.set(data.user ?? null);
    return { data, error };
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.user.set(null);
  }

  async getAll(table: string) {
    const { data, error } = await this.supabase.from(table).select('*');
    if (error) throw error;
    return data ?? [];
  }

  async insert<T>(table: string, row: Partial<T>) {
    const { data, error } = await this.supabase.from(table).insert([row]).select();
    if (error) throw error;
    return data;
  }

  async findUser(email: string) {
    const users = await this.getAll('users');
    return users.find(user => user.email === email);
  }

  async setupRealtime() {
    try {
      this.supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        console.log('payload:', payload);
        this.messages.update((msg) => [...msg, payload.new]);
      })
      .subscribe();
    } catch(e: any) {
      console.error('setupRealtime error:', e);
    }
  }
}
