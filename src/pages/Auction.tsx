import { useLocation, useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react'
import Header from '../components/ui/Header';
import { StatusCode } from '../constants/errorConstants';
import authStore from '../stores/auth.store';
import * as API from '../api/Api'

const Auction: FC = () => {
  //propi, vendar ji dobis preko navigate()
  const location = useLocation();
  const { item, user } = location.state;

  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const navigate = useNavigate()

  //dobi User data glede localni access_token
  const getUserData = async () => {
    // Fetch user data from API
    const userData = await API.fetchUser()
    console.log('Fetching User Data:', userData)

    // Check if userData is not undefined
    if (userData !== undefined) {
      //ce userData vrnil unauthorized, izbrisi localni access_token
      if (userData.statusCode === StatusCode.UNAUTHORIZED) {
        //ce si ze na main pageu IN obstaja access_token, force refreshaj stran
        if (location.pathname === '/'
          && window.localStorage.getItem(`access_token`)
        ) {
          authStore.signout()
          navigate('/', { state: window.location.reload() })
        }
        //vrni na main page
        else {
          //ce obstaja access_token, delete in vrni na root
          //(za ko userju potece access_token ko je nekje v aplikaciji (ki ni PUBLIC))
          if (authStore.user) {
            authStore.signout()
            navigate('/')
          }
          //ce ni access_tokena, da lahko obiskuje PUBLIC page 
          authStore.signout()
        }
      }
      // else {
      //   setUser(userData)
      // }
    }
  }

  //signout funkcionalnost kjer nastavimo user (v tem fileu) na null
  const signout = async () => {
    const response = await API.signout()
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      // setApiError(response.data.message)
      // setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      // setApiError(response.data.message)
      // setShowError(true)
    } else {
      console.log("Signing out")
      authStore.signout()
      user.id = 0
      user.firstName = undefined
      user.lastName = undefined
      user.email = ''
      user.image = undefined
      navigate('/')
    }
  }

  const handleHeaderRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      const height = ref.getBoundingClientRect().height
      setHeaderHeight(height)
      console.log("Header height:", headerHeight)
    }
  }

  // useEffect(() => {
  //   // if (headerRef.current) {
  //   //     const height = headerRef.current.getBoundingClientRect().height
  //   //     setHeaderHeight(height)
  //   //     console.log("HH:",headerHeight)
  //   // }
  //   const fetchData = async () => {
  //     // dobi userja ob zagonu komponente
  //     await getUserData()
  //   }
  //   //fetchData function ter pocakaj da se getUserData izvede
  //   fetchData()
  // }, [])

  useEffect(() => {
    console.log(`Item:\nId: ${item.id}\nTitle: ${item.title}\n
    Description: ${item.description}\n Price: ${item.currentPrice}\n
    Status: ${item.status}\n Duration: ${item.duration}\n
    Image: ${item.image}\n User: ${item.userId}\n`)
  }, [])

  return (
    <>
      <Header
        setRef={handleHeaderRef}
        user={user}
        refreshUserData={getUserData}
        signout={signout}
      />
      {/* da bo div stretchal do konca strani (full page AMPAK odstrani height Headerja) */}
      <div className="flex flex-col" style={{ height: `calc(100vh - ${headerHeight + 1}px)` }}>
        <div className="flex flex-grow flex-wrap p-2 bg-gray-100">
          {item.image && item.image !== "" ? (
            <div className="w-1/2">
              <img
                className="w-full h-full object-cover rounded-2xl"
                src={`${process.env.REACT_APP_API_URL}/files/${item.image}`} alt="Item image" />
            </div>
          ) : (
            <div className="w-1/2 bg-gray-200 flex items-center justify-center rounded-2xl">
              <span className='text-xl font-bold' >No Image Available</span>
            </div>
          )}
          <div className="w-1/2 p-4 info">
            {/* Your info content goes here */}
            <h2 className="text-2xl font-bold">Item Information</h2>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Auction
