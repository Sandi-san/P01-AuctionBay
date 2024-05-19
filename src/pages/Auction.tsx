import { useLocation, useNavigate } from 'react-router-dom'
import { FC, useEffect, useState } from 'react'
import Header from '../components/ui/Header'
import { StatusCode } from '../constants/errorConstants'
import authStore from '../stores/auth.store'
import * as API from '../api/Api'
import { Button } from 'react-bootstrap'
import { BidType } from '../models/bid'
import Avatar from 'react-avatar'

const Auction: FC = () => {
  //propi, vendar ji dobis preko navigate()
  const location = useLocation()
  const { item, user } = location.state

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

  //stevilo bidov od auctiona
  const [numBids, setNumBids] = useState(0)

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

  const [time, setTime] = useState('0')
  const [dateClose, setDateClose] = useState(false)

  //za place new bid
  const [bidValue, setBidValue] = useState(0)

  //ostali bidi od aucitona
  const [bids, setBids] = useState<BidType[]>([])

  //sekunde v time remaining za auction
  const secondsToTimeString = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes}m`
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      return `${hours}h`
    } else {
      const days = Math.floor(seconds / 86400)
      return `${days}d`
    }
  }
  //kalkuliraj razliko med trenutnim casom in end date auctiona
  const calculateDate = () => {
    const timeDifference = (new Date(item.duration)).valueOf() - (new Date()).valueOf()
    // console.log(`Times: ${timeDifference}`)

    if (timeDifference > 0) {
      let timeRemaining = timeDifference / 1000
      timeRemaining = Math.ceil(timeRemaining)
      //spremeni background timea, ce je manj ko 24h
      if (timeRemaining < 86400)
        setDateClose(true)
      const time = secondsToTimeString(timeRemaining)
      setTime(time)
    }
  }

  //kalkuliraj date ob zagonu widgeta
  useEffect(() => {
    getBidsData()
    calculateDate()
  }, [])


  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value, 10) // Parse the input value as a number
    if (!isNaN(inputValue)) {
      setBidValue(inputValue) // Update the bid value if it's a valid number
      console.log("Bid:", inputValue)
    }
  }

  const handlePlaceBid = () => {
    // Call a function with the bid value
    console.log('Placing bid with value:', bidValue)
  }


  //dobi Bide od auctiona
  const getBidsData = async () => {
    // Fetch user data from API
    const response = await API.fetchBids(item.id)
    console.log('Fetching Bids Data:', response)

    // Check if userData is not undefined
    if (response !== undefined) {
      setBids(response)
      console.log("Bids:", bids)
      //ce userData vrnil unauthorized, izbrisi localni access_token
      if (response.statusCode === StatusCode.UNAUTHORIZED) {
        //ce si ze na main pageu IN obstaja access_token, force refreshaj stran
        // if (location.pathname === '/'
        //   && window.localStorage.getItem(`access_token`)
        // ) {
        //   authStore.signout()
        //   navigate('/', { state: window.location.reload() })
        // }
        // //vrni na main page
        // else {
        //   //ce obstaja access_token, delete in vrni na root
        //   //(za ko userju potece access_token ko je nekje v aplikaciji (ki ni PUBLIC))
        //   if (authStore.user) {
        //     authStore.signout()
        //     navigate('/')
        //   }
        //   //ce ni access_tokena, da lahko obiskuje PUBLIC page 
        //   authStore.signout()
        // }
      }
    }
  }

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
          {/* Auction Image - LEVO */}
          {item.image && item.image !== "" ? (
            <div className="w-1/2 px-2">
              <img
                className="w-full object-cover rounded-2xl" style={{ height: `calc(100vh - ${headerHeight + 16}px)` }}
                src={`${process.env.REACT_APP_API_URL}/files/${item.image}`} alt="Item image" />
            </div>
          ) : (
            <div className="w-1/2 px-2 bg-gray-200 flex items-center justify-center rounded-2xl">
              <span className='text-xl font-bold' >No Image Available</span>
            </div>
          )}
          {/* Auction Info - DESNO */}
          <div className="w-1/2 px-2 info flex flex-col">
            {/* Auction info - ZGORAJ (1/3 prostora) */}
            <div className="bg-white rounded-xl p-4 mb-4 h-1/3 flex flex-col">
              {/* Tag header section (status, time) */}
              <div className="flex justify-between mb-1 h-1/8">
                {/* left tag: status */}
                <span className="bg-customYellow py-1 px-2 rounded-full text-xs">{item.status}</span>
                {/* right tag: date */}
                {/* ce casa ze zmanjkalo (date v preteklost) ne kazi tega */}
                {time !== '0' && (
                  <span className={`py-1 px-2 rounded-full text-xs 
                        ${dateClose ? 'bg-red-300' : ''}`}>{time}
                    <svg
                      className='bi bi-clock-history inline-block w-3.5 ml-1'
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                    </svg>
                  </span>
                )}
              </div>
              {/* Item title in description */}
              <div className="flex flex-col h-6/8 overflow-hidden">
                <h2 className="text-2xl font-bold p-1">{item.title}</h2>
                <div className="flex-grow overflow-auto">
                  <p className="whitespace-pre-wrap">{item.description}</p>
                </div>
              </div>
              {/* Bid button */}
              <div className="h-1/8 flex items-center justify-end mt-1">
                <span className="mr-2">Bid:
                  <input type="number" value={bidValue} onChange={handleBidChange}
                    className="border border-gray-300 w-20 px-2 py-1 ml-2 rounded-xl" />
                </span>
                <Button onClick={handlePlaceBid} className='bg-customYellow px-4 py-1 rounded-xl '>Place bid</Button>
              </div>
            </div>

            {/* Bidi - SPODAJ (2/3 prostora */}
            <div className="bg-white rounded-xl p-4 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-2">Bidding history ({numBids})</h2>
              <div
                //ce ni bidov, daj 'No bids' text v sredino, sicer bide na vrh
                className={
                  bids.length === 0
                    ? 'flex-grow overflow-y-auto flex'
                    : 'flex-grow overflow-y-auto'
                }>
                {bids.length > 0 ? (bids.map((bid, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-300 p-2">
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-4">
                        <Avatar
                          size='48'
                          round
                          src={
                            `${process.env.REACT_APP_API_URL}/files/${bid.user.image}`
                          }
                          alt="No image" />
                      </div>
                      {/* User Name or Email */}
                      <div>
                        <p className="font-semibold">{bid.user.firstName || bid.user.email}</p>
                        <p className="text-sm text-gray-500">{bid.user.lastName || 'No Last Name'}</p>
                      </div>
                    </div>
                    {/* Creation Date */}
                    <p className="text-sm text-gray-500 mr-2">
                      {new Date(bid.createdAt).toLocaleTimeString()}
                      &nbsp;{new Date(bid.createdAt).toLocaleDateString()}</p>
                    {/* Bid Price */}
                    <p className="font-semibold">${bid.price}</p>
                  </div>
                ))) : (
                  <div className="flex flex-col flex-grow justify-center items-center text-center">
                    <p className="text-lg font-bold">No bids yet!</p>
                    <p className="text-sm text-gray-500 mt-2">Place your bid to have a chance to get this item.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Auction
