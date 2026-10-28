export const routes = {
  root: '/',
  overview: '/overview',
  candidates: '/candidates',
  candidatesDetail: '/candidates/:id',
  verificationCases: '/verification-cases',
  createCase: '/verification-cases/create',
  caseDetail: '/verification-cases/:id',
  documents: '/documents',
  reports: '/reports',
  auditLogs: '/audit-logs',
  settings: '/settings',
} as const

export type AppRoutes = keyof typeof routes
