#!/usr/bin/env node
/**
 * Opens a public tunnel to localhost:3000 so colleagues can test the app.
 * Updates Supabase creator domain and .env.local PUBLIC_APP_URL.
 *
 * Usage: npm run share
 * Requires: npm run dev (in another terminal)
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const http = require('http')

const ROOT = path.join(__dirname, '..')
const ENV_PATH = path.join(ROOT, '.env.local')
const LOCAL_DOMAIN = 'test.localhost:3000'
const PORT = 3000
const CREATOR_SLUG = 'test-creator'

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('❌ .env.local not found')
    process.exit(1)
  }
  const env = {}
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m) env[m[1]] = m[2].trim()
  }
  return env
}

function checkDevServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
      res.resume()
      resolve(res.statusCode < 500)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(3000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

function setEnvPublicUrl(url) {
  let content = fs.readFileSync(ENV_PATH, 'utf8')
  const line = `PUBLIC_APP_URL=${url}`

  if (/^PUBLIC_APP_URL=/m.test(content)) {
    content = content.replace(/^PUBLIC_APP_URL=.*$/m, line)
  } else {
    content = content.trimEnd() + `\n\n# Public URL for sharing with colleagues\n${line}\n`
  }

  fs.writeFileSync(ENV_PATH, content)
}

function removeEnvPublicUrl() {
  let content = fs.readFileSync(ENV_PATH, 'utf8')
  content = content.replace(/\n# Public URL for sharing with colleagues\nPUBLIC_APP_URL=.*\n?/g, '\n')
  content = content.replace(/^PUBLIC_APP_URL=.*\n?/m, '')
  fs.writeFileSync(ENV_PATH, content.trimEnd() + '\n')
}

async function updateCreatorDomain(supabaseUrl, serviceKey, domain) {
  const host = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const listRes = await fetch(
    `${supabaseUrl}/rest/v1/creators?slug=eq.${CREATOR_SLUG}&select=id,primary_domain`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  )
  const creators = await listRes.json()
  if (!creators?.[0]?.id) {
    throw new Error(`Creator "${CREATOR_SLUG}" not found in Supabase`)
  }

  const patchRes = await fetch(
    `${supabaseUrl}/rest/v1/creators?id=eq.${creators[0].id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ primary_domain: host }),
    }
  )

  if (!patchRes.ok) {
    throw new Error(`Failed to update creator domain: ${await patchRes.text()}`)
  }

  return host
}

async function main() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const devRunning = await checkDevServer()
  if (!devRunning) {
    console.error('❌ Dev server not running on port 3000')
    console.error('   Start it first: npm run dev')
    process.exit(1)
  }

  console.log('🌐 Starting public tunnel (Cloudflare)...')
  console.log('   This may take 10–15 seconds.\n')

  const cloudflared = spawn(
    'npx',
    ['--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${PORT}`],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  )

  let publicUrl = null
  let cleanedUp = false

  const tryParseUrl = (text) => {
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)
    return match ? match[0] : null
  }

  const onOutput = (chunk) => {
    process.stderr.write(chunk)
    if (!publicUrl) {
      publicUrl = tryParseUrl(chunk.toString())
      if (publicUrl) setupSharing(publicUrl)
    }
  }

  cloudflared.stdout.on('data', onOutput)
  cloudflared.stderr.on('data', onOutput)

  async function setupSharing(url) {
    try {
      const host = await updateCreatorDomain(supabaseUrl, serviceKey, url)
      setEnvPublicUrl(url)

      console.log('\n' + '═'.repeat(60))
      console.log('✅ Готово! Отправьте коллегам:')
      console.log('═'.repeat(60))
      console.log(`\n   🏠 Главная:  ${url}`)
      console.log(`   🔐 Вход:     ${url}/login`)
      console.log(`   📱 Feed:     ${url}/app`)
      console.log('\n📋 Как тестировать:')
      console.log('   1. Коллега открывает ссылку входа')
      console.log('   2. Вводит email → Send Magic Link')
      console.log('   3. Вы копируете magic link из ЭТОГО терминала (npm run dev)')
      console.log('      и отправляете коллеге в Slack/Telegram')
      console.log('\n⚠️  Перезапустите npm run dev чтобы magic links использовали публичный URL')
      console.log('\n   Ctrl+C здесь — tunnel закроется, домен вернётся на test.localhost:3000')
      console.log('═'.repeat(60) + '\n')
    } catch (err) {
      console.error('❌', err.message)
      cleanup()
      process.exit(1)
    }
  }

  async function cleanup() {
    if (cleanedUp) return
    cleanedUp = true

    console.log('\n🔄 Restoring local domain...')
    try {
      await updateCreatorDomain(supabaseUrl, serviceKey, LOCAL_DOMAIN)
      removeEnvPublicUrl()
      console.log(`✅ Creator domain restored to ${LOCAL_DOMAIN}`)
      console.log('   Restart npm run dev to use local URLs again.')
    } catch (err) {
      console.error('⚠️  Could not restore domain:', err.message)
      console.error(`   Run in Supabase SQL: UPDATE creators SET primary_domain = '${LOCAL_DOMAIN}' WHERE slug = '${CREATOR_SLUG}';`)
    }
  }

  process.on('SIGINT', () => {
    cloudflared.kill()
    cleanup().then(() => process.exit(0))
  })

  cloudflared.on('exit', () => {
    cleanup().then(() => process.exit(0))
  })

  setTimeout(() => {
    if (!publicUrl) {
      console.error('❌ Tunnel URL not received in 30s. Try again.')
      cloudflared.kill()
      process.exit(1)
    }
  }, 30000)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
