import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://vyzyrqihzoexrphxjvjj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5enlycWloem9leHJwaHhqdmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NjU5NTcsImV4cCI6MjA0MzA0MTk1N30.aNwDU5L-7orBrEKf1jobBxdTB8sgQd599VdHQdjV9iU'
    );
  }
}
