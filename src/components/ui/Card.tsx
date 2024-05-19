import { FC, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { AuctionType } from '../../models/auction'
import { UserType } from '../../models/auth'
import EditAuction from '../auction/EditAuction'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'

//shrani item v Props
interface Props {
    item: AuctionType
    user: UserType | null
    fetchAuctions: () => Promise<void>
}

const Card: FC<Props> = ({ item, user, fetchAuctions }) => {
    //za error prikazovanje (Toast)
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    // destruct props v posamezni var
    const { id, title, currentPrice, image, status, duration, userId } = item
    const [time, setTime] = useState('0')
    const [dateClose, setDateClose] = useState(false)

    //da izrises buttone v auctionu ce je od trenutnega userja
    const isOwner = user?.id === userId

    //Popup editAuction
    const [showEditAuction, setShowEditAuction] = useState(false);

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
        const timeDifference = (new Date(duration)).valueOf() - (new Date()).valueOf()
        // console.log(`Times: ${timeDifference}`)

        if (timeDifference > 0) {
            let timeRemaining = timeDifference / 1000
            timeRemaining = Math.ceil(timeRemaining)
            //spremeni background timea, ce je manj ko 24h
            if (timeRemaining < 86400)
                setDateClose(true)
            else
                setDateClose(false)
            const time = secondsToTimeString(timeRemaining)
            setTime(time)
        }
    }

    //kalkuliraj date ob zagonu widgeta
    useEffect(() => {
        calculateDate()
    }, [])

    //Za ko preklaplas med tabim v Profile
    useEffect(() => {
        calculateDate()
    }, [fetchAuctions])

    //klici delete auction
    const handleDeleteAuction = async () => {
        console.log("Calling delete for id:", id)
        console.log("User:", user)
        const response = await API.deleteAuction(id)

        if (response.data?.statusCode === StatusCode.NOT_FOUND) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.UNAUTHORIZED) {
            console.log("You are not logged in or access token has expired.")
            navigate(location.pathname, { state: window.location.reload() })
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        }
        else {
            console.log("Successfully deleted auction with id: ", id)
            fetchAuctions()
        }
    }

    //Popup editAuction
    const toggleEditAuctionPopup = () => {
        setShowEditAuction(!showEditAuction)
        console.log("Closing and fetching Auction")
        fetchAuctions()
    }


    const openAuction = () => {
        console.log(`Item: ${item.id}\nUser: ${user?.id}`)
        // Navigate to Auction page with item data passed as props
        navigate('/auction', { state: { item: item, user: user } })
    }

    return (
        <>
            <div className="h-[260px] w-[205px] bg-white rounded-2xl flex flex-col overflow-hidden">
                {/* sekcija kjer odpres auction (izven buttonov za delete/update) */}
                <div onClick={openAuction} className='on-click-section cursor-pointer
                 h-[260px] w-[205px]  flex flex-col overflow-hidden'>
                    {/* Content section */}
                    <div className="pt-2 pr-2 pl-2 pb-1">
                        {/* Tag header section */}
                        <div className="flex justify-between mb-2">
                            {/* left tag: status */}
                            <span className="bg-customYellow py-1 px-2 rounded-full text-xs">{status}</span>
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

                        {/* Title section */}
                        <div className="flex flex-col items-start mb-2">
                            <p className="text-lg text-color-primary">{title}</p>
                        </div>

                        {/* Price section */}
                        <div className="flex flex-col items-start">
                            <p className="text-color-primary font-bold font-medium text-16 leading-24">{currentPrice}€</p>
                        </div>
                    </div>

                    {/* Image container */}
                    <div
                        className={
                            //malce squishaj image za buttone
                            isOwner
                                ? 'flex justify-center items-center overflow-hidden h-2/3'
                                : 'flex justify-center items-center overflow-hidden h-full'
                        }>
                        {/* className={isOwner ? 'flex justify-center items-center overflow-hidden h-2/3' : 'flex justify-center items-center overflow-hidden h-full'}> */}
                        <img src={`${process.env.REACT_APP_API_URL}/files/${image}`} alt="Product" className="rounded-xl object-cover h-full w-full p-2" />
                    </div>
                </div>

                {/* ce auction trenutno vpisanega userja, prikazi delete/edit buttone */}
                {isOwner && (
                    <div className="flex justify-between px-3 pb-1">
                        <button className="text-gray-900 border border-black bg-white custom-button py-1 px-2 rounded-xl"
                            onClick={handleDeleteAuction}>
                            <svg className="bi bi-trash h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </button>
                        <button
                            className="flex justify-center bg-black text-white py-1 px-2 ml-1 rounded-xl w-full"
                            onClick={toggleEditAuctionPopup}>
                            <svg className="bi bi-pencil h-4 w-4 mt-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                            </svg>
                            Edit
                        </button>
                    </div>
                )}

                {/* Edit Auction Popup */}
                {showEditAuction && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-4">
                            <EditAuction
                                auction={item}
                                closePopup={toggleEditAuctionPopup} //zapri ta popup
                                //referenca na fetchAuctions funkcijo v Auctions
                                fetchAuctions={fetchAuctions}
                            />
                        </div>
                    </div>
                )}
            </div>
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
export default Card
//userId} vs {user?.id
