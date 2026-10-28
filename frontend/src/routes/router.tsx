import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './paths'
import { Layout } from '@/components/layout/layout'

const OverviewPage = React.lazy(() =>
  import('@/pages/OverviewPage').then((mod) => ({ default: mod.OverviewPage }))
)
const CandidatesPage = React.lazy(() =>
  import('@/pages/CandidatesPage').then((mod) => ({ default: mod.CandidatesPage }))
)
const CandidateDetailPage = React.lazy(() =>
  import('@/pages/CandidateDetailPage').then((mod) => ({ default: mod.CandidateDetailPage }))
)
const VerificationCasesPage = React.lazy(() =>
  import('@/pages/VerificationCasesPage').then((mod) => ({ default: mod.VerificationCasesPage }))
)
const CreateCasePage = React.lazy(() =>
  import('@/pages/CreateCasePage').then((mod) => ({ default: mod.CreateCasePage }))
)
const CaseDetailPage = React.lazy(() =>
  import('@/pages/CaseDetailPage').then((mod) => ({ default: mod.CaseDetailPage }))
)
const DocumentsPage = React.lazy(() =>
  import('@/pages/DocumentsPage').then((mod) => ({ default: mod.DocumentsPage }))
)
const ReportsPage = React.lazy(() =>
  import('@/pages/ReportsPage').then((mod) => ({ default: mod.ReportsPage }))
)
const AuditLogsPage = React.lazy(() =>
  import('@/pages/AuditLogsPage').then((mod) => ({ default: mod.AuditLogsPage }))
)
const SettingsPage = React.lazy(() =>
  import('@/pages/SettingsPage').then((mod) => ({ default: mod.SettingsPage }))
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: routes.overview.slice(1), element: <OverviewPage /> },
      { path: routes.candidates.slice(1), element: <CandidatesPage /> },
      { path: routes.candidatesDetail.slice(1), element: <CandidateDetailPage /> },
      { path: routes.verificationCases.slice(1), element: <VerificationCasesPage /> },
      { path: routes.createCase.slice(1), element: <CreateCasePage /> },
      { path: routes.caseDetail.slice(1), element: <CaseDetailPage /> },
      { path: routes.documents.slice(1), element: <DocumentsPage /> },
      { path: routes.reports.slice(1), element: <ReportsPage /> },
      { path: routes.auditLogs.slice(1), element: <AuditLogsPage /> },
      { path: routes.settings.slice(1), element: <SettingsPage /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
