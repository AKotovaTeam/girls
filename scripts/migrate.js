const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function runMigration() {
  const migrationFile = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
  const sql = fs.readFileSync(migrationFile, 'utf8')
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`Running ${statements.length} SQL statements...`)
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      if (error) {
        // If exec_sql doesn't exist, try direct query (may not work for all statements)
        console.log(`Statement ${i + 1}: ${statement.substring(0, 50)}...`)
        // Note: Supabase JS client doesn't support arbitrary SQL execution
        // You'll need to run migrations via Supabase dashboard or CLI
        console.warn('Direct SQL execution not supported. Please run migrations via Supabase dashboard or CLI.')
        break
      }
    } catch (err) {
      console.error(`Error executing statement ${i + 1}:`, err)
    }
  }
  
  console.log('Migration complete!')
  console.log('\nNote: If you see warnings above, please run the migration SQL manually in your Supabase dashboard:')
  console.log('1. Go to Supabase Dashboard > SQL Editor')
  console.log('2. Copy the contents of supabase/migrations/001_initial_schema.sql')
  console.log('3. Paste and execute')
}

runMigration().catch(console.error)


