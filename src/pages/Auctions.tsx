import { FC, useEffect, useState } from 'react'
import { AuctionType } from '../models/auction'
import { useLocation, useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { StatusCode } from '../constants/errorConstants'
import Card from '../components/ui/Card'
import { UserType } from '../models/auth'
import * as API from '../api/Api'
import PaginateButtons from '../components/ui/PaginateButtons'
import authStore from '../stores/auth.store'
import { routes } from '../constants/routesConstants'

interface Props {
  headerHeight: number
  user: UserType | null // Receive user variable as prop
}

const Auctions: FC<Props> = ({ headerHeight, user }) => {
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

  const fetchAuctionsData = async () => {
    try {
      //iz url dobi ?page in stevilko za njim
      const pageParam = new URLSearchParams(location.search).get('page')
      const page = pageParam ? parseInt(pageParam) : 1
      const response = await API.fetchAuctions(page)
    
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
      } else {
        setAuctions(response.data.data)
        //nastavi page
        setCurrentPage(page)
        //dobi stevilo zadnjega pagea iz responsa
        setTotalPages(response.data.meta.last_page)
        
        console.log("Auctions:",response)
        console.log("Total Pages:",totalPages)
        console.log("Page:",page)
      }
    } catch (error) {
      console.error('Error fetching auctions:', error)
      setShowSuccess(false)
      setShowError(true)
    }
  }

  useEffect(() => {
    fetchAuctionsData()
  }, [location.search])

  // Pagination logic
  const goToPage = (pageNumber: number) => {
    navigate(`${routes.AUCTIONS}?page=${pageNumber}`)
  }

  return (
    <>
      {/* da bo div stretchal do konca strani (full page AMPAK odstrani height Headerja) */}
      <div className="flex flex-col" style={{ height: `calc(100vh - ${headerHeight + 1}px)` }}>
        <h1 className="text-2xl font-bold mt-4 ml-4">Auctions</h1>
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

            <PaginateButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-center text-center">
            <p className="text-lg font-bold">Oh no, no auctions yet!</p>
            <p className="text-sm text-gray-500 mt-2">To add new auctions click "+" button in
              <br />navigation bar or wait for other users<br />to add new auctions.</p>
          </div>
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

export default Auctions
