import { resolveTenantDetailed } from '@/lib/tenant'
import { headers } from 'next/headers'
import { LoginForm } from './login-form'
import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/auth'

export default async function LoginPage() {
  const host = (await headers()).get('host') || ''
  const { creator, error: tenantError } = await resolveTenantDetailed(host)
  const account = await getCurrentAccount()
  
  if (account) {
    redirect('/app')
  }
  
  if (!creator) {
    const hostOk = host.split(':')[0].toLowerCase() === 'test.localhost'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'не задан'

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Creator not found</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
            {hostOk && tenantError === 'db_error' ? (
              <>
                <h2 className="font-semibold text-gray-900 mb-3">Host правильный — проблема в Supabase</h2>
                <p className="text-sm text-gray-700 mb-4">
                  Адрес <code className="bg-yellow-100 px-2 py-1 rounded">{host}</code> верный,
                  но приложение не может подключиться к базе данных.
                </p>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Откройте <a href="https://supabase.com/dashboard" className="text-rose-600 underline" target="_blank" rel="noreferrer">Supabase Dashboard</a> и создайте проект (или найдите существующий)</li>
                  <li>Скопируйте из Settings → API: Project URL, anon key, service_role key</li>
                  <li>Обновите <code className="bg-yellow-100 px-1 rounded">.env.local</code> ключами из Settings → API (формат <code className="bg-yellow-100 px-1 rounded">sb_publishable_...</code> или <code className="bg-yellow-100 px-1 rounded">eyJ...</code>)</li>
                  <li>Выполните SQL из <code className="bg-yellow-100 px-1 rounded">supabase/migrations/0001_init_white_label.sql</code></li>
                  <li>Перезапустите сервер: <code className="bg-yellow-100 px-1 rounded">npm run dev</code></li>
                </ol>
                <p className="mt-4 text-xs text-gray-600">
                  Текущий Supabase URL: <code className="bg-gray-100 px-2 py-1 rounded break-all">{supabaseUrl}</code>
                </p>
              </>
            ) : hostOk && tenantError === 'not_found' ? (
              <>
                <h2 className="font-semibold text-gray-900 mb-3">Host правильный — creator не найден в базе</h2>
                <p className="text-sm text-gray-700 mb-4">
                  Supabase подключён, но в таблице <code className="bg-yellow-100 px-1 rounded">creators</code> нет
                  записи для <code className="bg-yellow-100 px-1 rounded">test.localhost:3000</code>.
                </p>
                <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                  <li>Откройте Supabase Dashboard → SQL Editor</li>
                  <li>Выполните скрипт из <code className="bg-yellow-100 px-1 rounded">check-creator.sql</code></li>
                  <li>Обновите страницу</li>
                </ol>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-gray-900 mb-3">Возможные причины:</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Вы используете неправильный URL. Используйте: <code className="bg-yellow-100 px-2 py-1 rounded">http://test.localhost:3000/login</code></li>
                  <li>• Creator не существует в базе данных. Проверьте в Supabase.</li>
                  <li>• Проблема с /etc/hosts. Убедитесь, что есть запись: <code className="bg-yellow-100 px-2 py-1 rounded">127.0.0.1 test.localhost</code></li>
                </ul>
              </>
            )}
            <p className="mt-4 text-xs text-gray-600">
              Текущий host: <code className="bg-gray-100 px-2 py-1 rounded">{host}</code>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-light text-gray-900 px-2">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600 font-light px-2">
            We'll send you a magic link to sign in
          </p>
        </div>
        <LoginForm creatorId={creator.id} creatorDomain={creator.primary_domain} />
      </div>
    </div>
  )
}

