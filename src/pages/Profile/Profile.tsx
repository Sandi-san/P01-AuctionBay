import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import * as API from '../../api/Api'
import { UserType } from '../../models/auth'
import { AuctionType } from '../../models/auction'
import { StatusCode } from '../../constants/errorConstants'
import Card from '../../components/ui/Card'
import authStore from '../../stores/auth.store'
import PaginateButtons from '../../components/ui/PaginateButtons'
import { routes } from '../../constants/routesConstants'

interface Props {
  headerHeight: number
  user: UserType | null
  currentTab: number
}

const Profile: FC<Props> = ({ headerHeight, user, currentTab }) => {
  //kam shranjujes vse Auctione od strani
  const [auctions, setAuctions] = useState<AuctionType[]>([])
  //current ?page= (za paginated prikaz)
  const [currentPage, setCurrentPage] = useState<number>(1)
  //total paginated strani (dobis iz db)
  const [totalPages, setTotalPages] = useState<number>(1)

  const navigate = useNavigate()
  const location = useLocation()

  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  //returnaj Auctione glede na current tab (my auctions, bidding, won)
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

      if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
        response.data?.statusCode === StatusCode.FORBIDDEN
      ) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.UNAUTHORIZED) {
        authStore.signout()
        console.log("You are not logged in or access token has expired.")
        navigate(location.pathname, { state: window.location.reload() })
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      }
      else {
        console.log("Response: ", response.data.data)
        setAuctions(response.data.data)
        setCurrentPage(page)
        setTotalPages(response.data.meta.last_page)
        // console.log("Auctions: ", auctions)
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
    navigate(`${routes.PROFILE}?page=${pageNumber}`)
  }

  //glede na katerem tabu smo, vrni content za izpis, ce so response Auctioni empty
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
            <p className="text-sm text-gray-500 mt-2">When you win auction items,<br />they will be displayed here.
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
          <>
            <div className="flex flex-wrap p-2 bg-gray-100"> {/* Flex container with wrapping */}
              {auctions.slice(0, 14).map((auction, index) => ( // Render maximum of 10 auctions
                <div key={index} className="m-1"> {/* Each auction with margin */}
                  <Card item={auction} user={user}
                    fetchAuctions={fetchAuctionsData} /> {/* Render the Card component for each auction */}
                </div>
              ))}
            </div>
            {/* buttoni za preklapljanje cez strani */}
            <PaginateButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        ) : (
          // izrisi tekst, ce ni Auctionov
          renderContent()
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
        {showSuccess && (
          <ToastContainer className="" position="top-end">
            <Toast onClose={() => setShowSuccess(false)} show={showSuccess}>
              <Toast.Header>
                <strong className="me-auto text-green-500 text-md">Success</strong>
              </Toast.Header>
            </Toast>
          </ToastContainer>
        )}
      </div>
    </>
  )
}
export default Profile
