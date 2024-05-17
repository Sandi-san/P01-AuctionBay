import { FC, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'
import { AuctionType } from '../../models/auction'

//shrani item v Props
interface Props {
    item: AuctionType
}

const Card: FC<Props> = ({ item }) => {
    // destruct props v posamezni var
    const { id, title, currentPrice, image, status, duration, userId } = item
    const [time, setTime] = useState('0')
    const [dateClose, setDateClose] = useState(false)

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

    const calculateDate = () => {
        const timeDuration = new Date(duration.valueOf())
        const timeNow = new Date(Date.now())
        const timeDifference = (new Date(duration)).valueOf() - (new Date()).valueOf()
        // console.log(`Times: ${timeDuration}\n ${timeNow}\n ${timeDifference}`)
        
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


    useEffect(() => {
        calculateDate()
    }, [])

    return (
        <div className="h-[240px] w-[206px] bg-white rounded-2xl flex flex-col overflow-hidden">
            {/* Content section */}
            <div className="pt-2 pr-2 pl-2 pb-1">
                {/* Tag header section */}
                <div className="flex justify-between mb-2">
                    {/* left tag: status */}
                    <span className="bg-customYellow py-1 px-2 rounded-full text-xs">{status}</span>
                    {/* right tag: date */}
                    {/* ce casa ze zmanjkalo (date v preteklost) ne kazi tega */}
                    {time !== '0' ? (
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
                    ) : (<></>)}
                </div>

                {/* Title section */}
                <div className="flex flex-col items-start mb-2">
                    <p className="text-lg text-color-primary">{userId}</p>
                </div>

                {/* Price section */}
                <div className="flex flex-col items-start">
                    <p className="text-color-primary font-bold font-medium text-16 leading-24">{currentPrice}€</p>
                </div>
            </div>

            {/* Image container */}
            <div className="flex justify-center items-center overflow-hidden h-full">
                <img src={`${process.env.REACT_APP_API_URL}/files/${image}`} alt="Product" className="rounded-xl object-cover h-full w-full p-2" />
            </div>
        </div>
    )
}
export default Card
