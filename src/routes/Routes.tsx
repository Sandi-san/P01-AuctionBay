import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'
import Loading from '../components/ui/Loading'
import Layout from '../components/ui/Layout'
import AuctionsIndex from '../pages/AuctionsIndex'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

//TODO: add all pages/routes

// Public routes
const Home = lazy(() => import('../pages/Home'))
const Auction = lazy(() => import('../pages/Auction'))
const Auctions = lazy(() => import('../pages/Auctions'))

// Private routes
const ProfileAuctions = lazy(() => import('../pages/Profile/Auctions'))
const ProfileBidding = lazy(() => import('../pages/Profile/Bidding'))
const ProfileWon = lazy(() => import('../pages/Profile/Won'))

// Restricted routes
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Password = lazy(() => import('../pages/Password'))

// Error routes
const Page404 = lazy(() => import('../pages/Page404'))

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/signup',
    children: <Register />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/forgot_password',
    children: <Password />,
  },

  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/profile/auction',
    children: <ProfileAuctions />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/profile/bidding',
    children: <ProfileBidding />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/profile/won',
    children: <ProfileWon />,
  },

  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  {
    type: RouteType.PUBLIC,
    path: '/auctions',
    children: <AuctionsIndex />,
    // children: <Auctions headerHeight={0} user={null} />,
    // children: (
    //   <Layout>
    //     {/* <Auctions headerHeight={0} user={null} /> */}
    //     <Auctions />
    //   </Layout>
    // ),
  },
  {
    type: RouteType.PUBLIC,
    path: '/auction',
    children: <Auction />,
  },

  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r;
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            );
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            );
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          );
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
