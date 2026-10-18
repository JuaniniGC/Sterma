import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CommunityDetailPage } from '@/features/community/pages/CommunityDetailPage'
import { CommunityListPage } from '@/features/community/pages/CommunityListPage'
import { EditCommunityPage } from '@/features/community/pages/EditCommunityPage'
import { NewCommunityPage } from '@/features/community/pages/NewCommunityPage'
import { ElevatorDetailPage } from '@/features/elevator/pages/ElevatorDetailPage'
import { EditElevatorPage } from '@/features/elevator/pages/EditElevatorPage'
import { ElevatorListPage } from '@/features/elevator/pages/ElevatorListPage'
import { NewElevatorPage } from '@/features/elevator/pages/NewElevatorPage'
import { MaintenanceRulesPage } from '@/features/maintenanceRule/pages/MaintenanceRulesPage'
import { NewMaintenanceRulePage } from '@/features/maintenanceRule/pages/NewMaintenanceRulePage'
import { NewIncidentReportPage } from '@/features/report/pages/NewIncidentReportPage'
import { NewMaintenanceReportPage } from '@/features/report/pages/NewMaintenanceReportPage'
import { ReportDetailPage } from '@/features/report/pages/ReportDetailPage'
import { HomePage } from './HomePage'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'
import { paths } from './paths'

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      {
        // Todas las rutas del panel requieren sesión
        element: <ProtectedRoute />,
        children: [
          {
            path: paths.home,
            element: <AppLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: paths.communities, element: <CommunityListPage /> },
              { path: paths.newCommunity, element: <NewCommunityPage /> },
              { path: paths.communityDetail, element: <CommunityDetailPage /> },
              { path: paths.editCommunity, element: <EditCommunityPage /> },
              { path: paths.elevators, element: <ElevatorListPage /> },
              { path: paths.newElevator, element: <NewElevatorPage /> },
              { path: paths.elevatorDetail, element: <ElevatorDetailPage /> },
              { path: paths.editElevator, element: <EditElevatorPage /> },
              { path: paths.newIncidentReport, element: <NewIncidentReportPage /> },
              { path: paths.newMaintenanceReport, element: <NewMaintenanceReportPage /> },
              { path: paths.incidentReportDetail, element: <ReportDetailPage kind="incident" /> },
              { path: paths.maintenanceReportDetail, element: <ReportDetailPage kind="maintenance" /> },
              { path: paths.maintenanceRules, element: <MaintenanceRulesPage /> },
              { path: paths.newMaintenanceRule, element: <NewMaintenanceRulePage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
