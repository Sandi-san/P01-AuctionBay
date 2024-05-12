import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

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


//TODO: add routes here
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
    children: <Auctions />,
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


//delete user aka access_token ko se stran zapre
export const deleteAccessToken = () => {
  localStorage.removeItem('user');
};

//event listener ko se stran zapre
export const setupSessionManagement = () => {
  window.addEventListener('beforeunload', deleteAccessToken);
};

const Routes: FC = () => {
  //manager za trenutni session
  setupSessionManagement();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
