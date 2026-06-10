const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('   Make sure .env.local has:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function runMigration() {
  const migrationFile = path.join(__dirname, 'supabase/migrations/0002_seed_jane_posts.sql')
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`)
    process.exit(1)
  }
  
  const sql = fs.readFileSync(migrationFile, 'utf8')
  
  console.log('🚀 Executing SQL migration...')
  console.log('📄 File: 0002_seed_jane_posts.sql')
  console.log('')
  
  try {
    // Supabase JS client doesn't support arbitrary SQL execution directly
    // We need to use the REST API or psql
    // For now, we'll use the REST API endpoint for running SQL
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`
      },
      body: JSON.stringify({ sql })
    })
    
    if (!response.ok) {
      // If exec_sql doesn't exist, we need to use a different approach
      // Try using the Supabase Management API or direct psql
      throw new Error('Direct SQL execution not available via REST API')
    }
    
    const result = await response.json()
    console.log('✅ Migration executed successfully!')
    console.log('')
    console.log('📋 Created 6 posts with images for test-creator')
    return result
  } catch (error) {
    console.error('⚠️  Cannot execute SQL directly via API')
    console.error('')
    console.error('📝 Please execute the migration manually:')
    console.error('')
    console.error('   1. Open Supabase Dashboard → SQL Editor')
    console.error('   2. Open file: supabase/migrations/0002_seed_jane_posts.sql')
    console.error('   3. Copy all SQL code (Cmd+A, Cmd+C)')
    console.error('   4. Paste in SQL Editor (Cmd+V)')
    console.error('   5. Click "Run" (or Cmd+Enter)')
    console.error('')
    console.error('💡 Or use Supabase CLI:')
    console.error('   supabase db push')
    console.error('')
    process.exit(1)
  }
}

runMigration().catch(console.error)


