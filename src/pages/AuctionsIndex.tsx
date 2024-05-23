import { FC, useEffect, useRef, useState } from 'react'
import Header from '../components/ui/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserType } from '../models/auth'
import { StatusCode } from '../constants/errorConstants'
import authStore from '../stores/auth.store'
import * as API from '../api/Api'
import Auctions from './Auctions'
import Loading from '../components/ui/Loading'
import { routes } from '../constants/routesConstants'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

//INDEX ZA AUCTIONE (ker v Auctions mores dat Props, kar ni dovoljeno v Routes)
const AuctionsIndex: FC = () => {
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  const navigate = useNavigate()
  const location = useLocation()

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

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

    // Check if userData is not undefined
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
          }
          //ce ni access_tokena, da lahko obiskuje PUBLIC page 
          authStore.signout()
        }
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
      <Header
        setRef={handleHeaderRef}
        user={user}
        refreshUserData={getUserData}
        signout={signout}
      />
      {headerHeight > 0 ? (
        <Auctions headerHeight={headerHeight} user={user} />
      ) : (
        <Loading />
      )}
      {showError && (
        <ToastContainer className="" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-auto text-red-500 text-md">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-red-500 bg-light text-sm">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default AuctionsIndex
