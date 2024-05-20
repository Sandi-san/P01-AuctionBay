import { useLocation, useNavigate } from 'react-router-dom'
import { FC, useEffect, useState } from 'react'
import Header from '../components/ui/Header'
import { StatusCode } from '../constants/errorConstants'
import authStore from '../stores/auth.store'
import * as API from '../api/Api'
import { Button, Form, FormLabel } from 'react-bootstrap'
import { BidType } from '../models/bid'
import Avatar from 'react-avatar'
import { Controller } from 'react-hook-form'
import { CreateBidFields, useCreateBidForm } from '../hooks/react-hook-form/useCreateUpdateBid'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

const Auction: FC = () => {
  const { handleSubmit, errors, control, setValue } = useCreateBidForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  //propi, vendar ji dobis preko navigate()
  const location = useLocation()
  const { item, user } = location.state

  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const navigate = useNavigate()

  //je user logged in?
  const [userLogged, setUserLogged] = useState<boolean>(false)

  //dobi User data glede localni access_token
  const getUserData = async () => {
    // Fetch user data from API
    const userData = await API.fetchUser()
    console.log('Fetching User Data:', userData)

    // Check if userData is not undefined
    if (userData !== undefined) {
      //ce userData vrnil unauthorized, izbrisi localni access_token
      if (userData.statusCode === StatusCode.UNAUTHORIZED) {
        authStore.signout()
        setUserLogged(false)
        console.log("You are not logged in or access token has expired.")
      }
      else {
        setUserLogged(true)
      }
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

  const [time, setTime] = useState('0')
  const [dateClose, setDateClose] = useState(false)

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
    getUserData()
    getBidsData()
    calculateDate()
    console.log("Item:", item)
    console.log("User:", user)
  }, [])

  useEffect(() => {
    setValue('price', item.currentPrice);
  }, [setValue, item.currentPrice]);

  const onSubmit = handleSubmit(async (data: CreateBidFields) => {
    console.log('Placing bid with value:', data)
    const response = await API.createBid(data, item.id)

    //TODO vsi status code ki lahko tu dobis
    if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
      response.data?.statusCode === StatusCode.NOT_FOUND) {
      setApiError(response.data.message)
      setShowError(true)
      setShowSuccess(false)
    }
    else if (response.data?.statusCode === StatusCode.UNAUTHORIZED) {
      setApiError(response.data.message)
      setShowError(true)
      setShowSuccess(false)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
      setShowSuccess(false)
    }
    else {
      setShowError(false)
      setShowSuccess(true)
      getBidsData()
    }
  })


  //dobi Bide od auctiona
  const getBidsData = async () => {
    // Fetch bid data from API
    const response = await API.fetchBids(item.id)
    console.log('Fetching Bids Data:', response)

    // Check if response is not undefined
    if (response !== undefined) {
      if (response.statusCode !== StatusCode.BAD_REQUEST) {
        setBids(response)
        console.log("Bids:", bids)
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
                  <p className="whitespace-pre-wrap">{item.description}
                  </p>
                </div>
              </div>

              {/* ce user ni logged in, ne prikazi bid buttona */}
              {/* Bid button */}
              {userLogged && (
                < div className="h-1/8 flex items-center justify-end mt-1">
                  <Form className="flex" onSubmit={onSubmit}>
                    {/* iz useLogin form */}
                    <Controller
                      control={control}
                      name="price"
                      defaultValue={item.currentPrice} // Set the default value here
                      render={({ field }) => (
                        <Form.Group className="flex">
                          <FormLabel className='mt-2' htmlFor="price">Bid:</FormLabel>
                          <div className='mr-2'>
                            <input
                              {...field}
                              type="number"
                              placeholder="0"
                              aria-label="Price"
                              aria-describedby="price"
                              className={
                                errors.price
                                  ? 'form-control-sm is-invalid'
                                  : 'form-control-sm'
                              }
                            />
                            {/* {errors.price && (
                            <div className="invalid-feedback">
                              {errors.price.message}
                            </div>
                          )} */}
                          </div>
                        </Form.Group>
                      )}
                    />
                    <Button type="submit" className='bg-customYellow px-4 py-1 rounded-xl '>Place bid</Button>
                  </Form>
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

            {/* Bidi - SPODAJ (2/3 prostora */}
            <div className="bg-white rounded-xl p-4 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-2">Bidding history ({bids.length})</h2>
              <div
                //ce ni bidov, daj 'No bids' text v sredino, sicer daj Bide na vrh
                className={
                  bids.length === 0
                    ? 'flex-grow overflow-y-auto flex'
                    : 'flex-grow overflow-y-auto'
                }>
                {/* iteriraj cez vsak bid in prikazi */}
                {bids.length > 0 ? (bids.map((bid, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-300 p-2">
                    {/* levi container */}
                    <div className="flex items-center pb-1">
                      {/* Avatar slika */}
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-4">
                        <Avatar
                          size='48'
                          round
                          src={
                            `${process.env.REACT_APP_API_URL}/files/${bid.user.image}`
                          }
                          alt="No image" />
                      </div>
                      {/* Prikazi first in lastname, ce ne obstajata oba, prikazi email */}
                      <div>
                        <p className="text-md text-gray-800">
                          {bid.user.firstName || bid.user.lastName
                            ? `${bid.user.firstName ?? ''} ${bid.user.lastName ?? ''}`
                            : bid.user.email}
                        </p>

                      </div>
                    </div>
                    {/* desni container */}
                    <div className="flex items-end pb-1">
                      {/* Creation Date */}
                      <p className="text-sm text-gray-800 mr-2 text-right mb-2">
                        {/* prikazi v EU formatu: cas, datum */}
                        {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(bid.createdAt))}
                        &nbsp;
                        {new Intl.DateTimeFormat('en-GB').format(new Date(bid.createdAt))}
                      </p>
                      {/* Bid Price */}
                      <p className="font-semibold bg-customYellow py-1 px-3 rounded-xl mb-1">{bid.price}€</p>
                    </div>
                  </div>
                ))) : (
                  // tekst v sredini, ko ni se nobenega bida
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
