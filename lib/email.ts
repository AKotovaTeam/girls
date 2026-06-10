/**
 * Sends a magic link email.
 * In production, integrate with your email service (SendGrid, Resend, etc.)
 * For MVP, this is a placeholder that logs the link.
 */
import { buildMagicLink, getAppBaseUrl } from './app-url'

export async function sendMagicLinkEmail(
  email: string,
  creatorDomain: string,
  token: string
): Promise<void> {
  const magicLink = buildMagicLink(creatorDomain, token)
  const baseUrl = getAppBaseUrl(creatorDomain)
  
  // TODO: Replace with actual email service integration
  // For now, log the link for development
  console.log('\n' + '='.repeat(70))
  console.log('🔗 MAGIC LINK EMAIL (Development Mode)')
  console.log('='.repeat(70))
  console.log(`📧 To: ${email}`)
  console.log('')
  console.log('🔗 FULL LINK (copy and send to user):')
  console.log('─'.repeat(70))
  console.log(magicLink)
  console.log('─'.repeat(70))
  console.log('')
  console.log('⚠️  ВАЖНО:')
  console.log('   1. Скопируйте ВСЮ ссылку выше (включая ?token=...)')
  console.log(`   2. Ссылка должна начинаться с: ${baseUrl}`)
  console.log('   3. Для коллег используйте публичный URL (npm run share)')
  console.log('   4. Вставьте ссылку в браузер и нажмите Enter')
  console.log('='.repeat(70) + '\n')
  
  // Example integration with a service like Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: process.env.SMTP_FROM,
  //   to: email,
  //   subject: 'Sign in to your account',
  //   html: `<a href="${magicLink}">Click here to sign in</a>`
  // })
}

