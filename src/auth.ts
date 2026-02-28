import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { isAdminGithubLogin, normalizeGithubLogin } from '@/lib/admin'

const githubClientId = process.env.GITHUB_ID ?? process.env.AUTH_GITHUB_ID ?? ''
const githubClientSecret =
  process.env.GITHUB_SECRET ?? process.env.AUTH_GITHUB_SECRET ?? ''

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'github') {
        return false
      }

      const githubLogin =
        profile &&
        typeof profile === 'object' &&
        'login' in profile &&
        typeof profile.login === 'string'
          ? normalizeGithubLogin(profile.login)
          : null

      return isAdminGithubLogin(githubLogin)
    },
    async jwt({ token, account, profile }) {
      if (
        account?.provider === 'github' &&
        profile &&
        typeof profile === 'object' &&
        'login' in profile &&
        typeof profile.login === 'string'
      ) {
        token.githubLogin = normalizeGithubLogin(profile.login)
      }

      token.isAdmin = isAdminGithubLogin(
        typeof token.githubLogin === 'string' ? token.githubLogin : null
      )

      return token
    },
    async session({ session, token }) {
      session.user.githubLogin =
        typeof token.githubLogin === 'string' ? token.githubLogin : null
      session.user.isAdmin = Boolean(token.isAdmin)
      return session
    },
  },
  pages: {
    error: '/ryong/denied',
  },
})
