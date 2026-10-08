import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CommunityDetailPage } from '@/features/community/pages/CommunityDetailPage'
import { CommunityListPage } from '@/features/community/pages/CommunityListPage'
import { ElevatorDetailPage } from '@/features/elevator/pages/ElevatorDetailPage'
import { ElevatorListPage } from '@/features/elevator/pages/ElevatorListPage'
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
              { path: paths.communityDetail, element: <CommunityDetailPage /> },
              { path: paths.elevators, element: <ElevatorListPage /> },
              { path: paths.elevatorDetail, element: <ElevatorDetailPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
