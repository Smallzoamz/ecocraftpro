import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otsyyjnebkfvbcmnhmhq.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90c3l5am5lYmtmdmJjbW5obWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTc0NzAsImV4cCI6MjA5MzU3MzQ3MH0.2819OKO6NdHGbyzZj0Ig_-r06H-bwspMNnVREzcCEdo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
