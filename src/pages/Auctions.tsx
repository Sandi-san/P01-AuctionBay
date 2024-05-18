import Header from '../components/ui/Header'
import { FC, useEffect, useRef, useState } from 'react'
import * as API from '../api/Api'
import { AuctionType } from '../models/auction'
import { useLocation, useNavigate } from 'react-router-dom'
import { StatusCode } from '../constants/errorConstants'
import Card from '../components/ui/Card'
import { UserType } from '../models/auth'

interface Props {
  headerHeight: number
  user: UserType | null // Receive user variable as prop
}

const Auctions: FC<Props> = ({ headerHeight, user }) => {
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
      const pageParam = new URLSearchParams(location.search).get('page')
      const page = pageParam ? parseInt(pageParam) : 1
      const response = await API.fetchAuctions(page)
      console.log(response)

      //TODO vsi status code ki lahko tu dobis
      if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
        response.data?.statusCode === StatusCode.FORBIDDEN ||
        response.data?.statusCode === StatusCode.UNAUTHORIZED
      ) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowSuccess(false)
        setShowError(true)
      }
      else {
        console.log("Response: ", response.data.data)
        setAuctions(response.data.data)
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
    fetchAuctionsData()
  }, [location.search])

  // Pagination logic
  const goToPage = (pageNumber: number) => {
    navigate(`/auctions?page=${pageNumber}`)
  }

  // useEffect(() => {
  //   if (headerRef.current) {
  //     setHeaderHeight(headerRef.current.clientHeight)
  //   }
  // }, [])

  return (
    <>
      {/* da bo div stretchal do konca strani (full page AMPAK odstrani height Headerja) */}
      <div className="flex flex-col" style={{ height: `calc(100vh - ${headerHeight + 1}px)` }}>
        <h1 className="text-2xl font-bold mt-4 ml-4">Auctions</h1>
        {auctions && auctions.length > 0 ? (
          <div className="flex flex-wrap p-2 bg-gray-100"> {/* Flex container with wrapping */}
            {auctions.slice(0, 10).map((auction, index) => ( // Render maximum of 10 auctions
              <div key={index} className="m-1"> {/* Each auction with margin */}
                <Card item={auction} user={user} 
                fetchAuctions={fetchAuctionsData}/> {/* Render the Card component for each auction */}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col flex-grow justify-center items-center text-center">
            <p className="text-lg font-bold">Oh no, no auctions yet!</p>
            <p className="text-sm text-gray-500 mt-2">To add new auctions click "+" button in
              <br />navigation bar or wait for other users<br />to add new auctions.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Auctions
