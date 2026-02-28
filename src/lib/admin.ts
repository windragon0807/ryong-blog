const adminGithubLogin = process.env.ADMIN_GITHUB_LOGIN?.trim().toLowerCase() ?? ''

export function normalizeGithubLogin(login: string | null | undefined): string | null {
  if (!login) {
    return null
  }

  return login.trim().toLowerCase()
}

export function isAdminGithubLogin(login: string | null | undefined): boolean {
  if (!adminGithubLogin) {
    return false
  }

  return normalizeGithubLogin(login) === adminGithubLogin
}

