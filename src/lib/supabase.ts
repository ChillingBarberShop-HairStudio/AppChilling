import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ycfftjtzjydxqttkzuii.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZmZ0anR6anlkeHF0dGt6dWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDY0NzQsImV4cCI6MjA5Nzg4MjQ3NH0.suZx0Es45h5CNe6y1v6a0Rtf-XVcbPfUp4TJZujyOVk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
