import { FC, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Header from '../../components/ui/Header'
import * as API from '../../api/Api'
import { UserType } from '../../models/auth'
import { AuctionType } from '../../models/auction'
import { StatusCode } from '../../constants/errorConstants'
import Card from '../../components/ui/Card'
import authStore from '../../stores/auth.store'

interface Props {
  headerHeight: number
  user: UserType | null // Receive user variable as prop
  currentTab: number
}

const Profile: FC<Props> = ({ headerHeight, user, currentTab }) => {
  //kam shranjujes vse Auctione od strani
  const [auctions, setAuctions] = useState<AuctionType[]>([])
  //current ?page= (za paginated prikaz)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const navigate = useNavigate()
  const location = useLocation()

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const fetchAuctionsData = async () => {
    try {
      console.log("Current tab: ", currentTab)
      const pageParam = new URLSearchParams(location.search).get('page')
      const page = pageParam ? parseInt(pageParam) : 1
      let response
      switch (currentTab) {
        case 1:
          response = await API.fetchUserAuctionsBidding(page)
          break
        case 2:
          response = await API.fetchUserAuctionsWon(page)
          break
        default:
          response = await API.fetchUserAuctions(page)

      }
      console.log(response)

      //TODO vsi status code ki lahko tu dobis
      if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
        response.data?.statusCode === StatusCode.FORBIDDEN
      ) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.UNAUTHORIZED) {
        authStore.signout()
        navigate('/')
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      }
      else {
        console.log("Response: ", response.data.data)
        setAuctions(response.data)
        setCurrentPage(page)
        console.log("Auctions: ", auctions)
      }
    } catch (error) {
      console.error('Error fetching auctions:', error)
      setShowSuccess(false)
      setShowError(true)
    }
  }

  useEffect(() => {
    setAuctions([])
    fetchAuctionsData()
  }, [currentTab, location.search])

  // Pagination logic
  const goToPage = (pageNumber: number) => {
    navigate(`/auctions?page=${pageNumber}`)
  }

  const renderContent = () => {
    switch (currentTab) {
      case 1:
        return (
          <div className="flex flex-col flex-grow justify-center items-center text-center">
            <p className="text-lg font-bold">No bidding in progress!</p>
            <p className="text-sm text-gray-500 mt-2">Start by finding new items
              <br />like on "Auction" page!</p>
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col flex-grow justify-center items-center text-center">
            <p className="text-lg font-bold">Nothing here yet!</p>
            <p className="text-sm text-gray-500 mt-2">When you win auction items,<br/>they will be displayed here.
              <br />Go and bid on your favorite items!</p>
          </div>
        )
      default:
        return (
          <div className="flex flex-col flex-grow justify-center items-center text-center">
            <p className="text-lg font-bold">Oh no, no auctions yet!</p>
            <p className="text-sm text-gray-500 mt-2">To add new auctions click "+" button in
              <br />navigation bar or wait for other users<br />to add new auctions.</p>
          </div>
        )
    }
  }

  return (
    <>
      {/* da bo div stretchal do konca strani (full page AMPAK odstrani height Headerja) */}
      <div className="flex flex-col" style={{ height: `calc(100vh - ${headerHeight + 1}px)` }}>
        <h1 className="text-2xl font-bold mt-4 ml-4">Hello&nbsp;
          {user?.firstName || user?.lastName
            ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`
            : user?.email}
          &nbsp;!
        </h1>
        {auctions && auctions.length > 0 ? (
          <div className="flex flex-wrap p-2 bg-gray-100"> {/* Flex container with wrapping */}
            {auctions.slice(0, 10).map((auction, index) => ( // Render maximum of 10 auctions
              <div key={index} className="m-1"> {/* Each auction with margin */}
                <Card item={auction} user={user}
                  fetchAuctions={fetchAuctionsData} /> {/* Render the Card component for each auction */}
              </div>
            ))}
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </>
  )
}
export default Profile
