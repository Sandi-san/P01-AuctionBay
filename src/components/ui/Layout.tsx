import { FC, ReactNode, useEffect, useState } from 'react'
import Header from './Header'
import { UserType } from '../../models/auth'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import authStore from '../../stores/auth.store'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { routes } from '../../constants/routesConstants'

interface Props {
  children: ReactNode | ReactNode[]
}

//LAYOUT KOT VMESNIK ZA PAGE Z HEADERJEM
const Layout: FC<Props> = ({ children }) => {
  //za error prikazovanje (Toast)
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  //visina headerja
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const navigate = useNavigate()
  const location = useLocation()

  //dobi user iz DB glede localni access_token
  const [user, setUser] = useState<UserType>({
    id: 0,
    firstName: undefined,
    lastName: undefined,
    email: '',
    image: undefined,
  })

  //dobi User data glede localni access_token
  const getUserData = async () => {
    // Fetch user data from API
    const response = await API.fetchUser()
    console.log('Fetching User Data:', response)

    //poglej ce vrnil userData
    if (response !== undefined) {
      //ce userData vrnil unauthorized, izbrisi localni access_token
      if (response.statusCode === StatusCode.UNAUTHORIZED) {
        //ce si ze na main pageu IN obstaja access_token, force refreshaj stran
        if (location.pathname === routes.HOME
          && window.localStorage.getItem(`access_token`)
        ) {
          authStore.signout()
          navigate(routes.HOME, { state: window.location.reload() })
        }
        //vrni na main page
        else {
          //ce obstaja access_token, delete in vrni na root
          //(za ko userju potece access_token ko je nekje v aplikaciji (ki ni PUBLIC))
          if (authStore.user) {
            authStore.signout()
            navigate(routes.HOME)
            // navigate(location.pathname, { state: window.location.reload() })
          }
          //ce ni access_tokena, da lahko obiskuje PUBLIC page 
          authStore.signout()
        }
      }
      //nastal internal error v backendu
      else if (response.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        authStore.signout()
        setApiError(response.data.message)
        setShowError(true)
      }
      else {
        setUser(response)
      }
    }
  }

  //signout funkcionalnost kjer nastavimo user (v tem fileu) na null
  const signout = async () => {
    const response = await API.signout()
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      console.log("Signing out")
      authStore.signout()
      setUser({
        id: 0,
        firstName: undefined,
        lastName: undefined,
        email: '',
        image: undefined,
      })
      navigate(routes.HOME)
    }
  }

  //zracunaj visino Header elementa (za renderiranje ostale strani)
  const handleHeaderRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      const height = ref.getBoundingClientRect().height
      setHeaderHeight(height)
      // console.log("Header height:", headerHeight)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // dobi userja ob zagonu komponente
      await getUserData()
    }
    //fetchData function ter pocakaj da se getUserData izvede
    fetchData()
  }, [])

  return (
    <>
    {/* klici header z propi */}
      <Header
        setRef={handleHeaderRef}
        user={user}
        refreshUserData={getUserData}
        signout={signout}
      />
      {/* ostali Widgeti strani */}
      {children}
      {/* prikazi error iz backenda */}
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-auto text-red-500">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-red-500 bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default Layout
