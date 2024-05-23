import { FC, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import authStore from '../../stores/auth.store'
import ProfilePopUp from '../user/ProfilePopUp'
import 'reactjs-popup/dist/index.css'
import Avatar from 'react-avatar'
import AddAuction from '../auction/AddAuction'
import { UserType } from '../../models/auth'
import { routes } from '../../constants/routesConstants'

interface Props {
    //referenca na Header element (v Parentu) da dobis dynamic visino
    setRef: (ref: HTMLDivElement | null) => void
    user: UserType | null
    //dobi user data in signout user funkciji
    refreshUserData: () => Promise<void>
    signout: () => Promise<void> 
}

const Header: FC<Props> = ({ setRef, user, refreshUserData, signout }) => {
    //Popup za add Auction formo
    const [showAddAuction, setShowAddAuction] = useState(false)

    //za User settings popup
    //ali je Popup za user settinge odprt ali ne
    const [showPopup, setShowPopup] = useState(false)
    //dimenzije popupa (za pravilne dimenzije parenta)
    const [popupDimensions, setPopupDimensions] = useState({ height: 0 })
    //referenca na Popup element
    const popupRef = useRef<HTMLDivElement | null>(null)
    //referenca na Button element ki odpre Popup
    const buttonRef = useRef<HTMLButtonElement>(null)

    //referenca na header (za velikost Widgeta)
    const headerRef = useRef<HTMLDivElement>(null)

    //za preverjanje na kateri strani smo (spremninjanje button stilov (Auction/Profile))
    const location = useLocation()

    //preview za user sliko v <img> elementu
    const [preview, setPreview] = useState<string | null>(null)

    //effect, ko se stran nalozi
    useEffect(() => {
        //click kjerkoli na screenu
        const handleClick = (event: MouseEvent) => {
            // setButtonClicked(false)

            //check ce je click v buttonu, ki odpre Popup (potrebno za pravilni toggle)
            if (buttonRef.current && event.target instanceof Node && buttonRef.current.contains(event.target)) {
                // console.log("Clicked on button")
                //potrebni koncat izvajanje funkcije, da se toggle pravilno obnasa
                return
            }
            //check ce je click v Popup formu (ko je ze odprt)
            else if (popupRef.current && event.target instanceof Node && popupRef.current.contains(event.target)) {
                const height = popupRef.current.getBoundingClientRect()
                setPopupDimensions(height)
                return
            }
            else {
                //click izven Popup
                setShowPopup(false)
            }
        }

        //dodaj listener ko se nalozi page
        document.addEventListener('mousedown', handleClick)
        return () => {
            //odstrani listener ko se page zapre
            document.removeEventListener('mousedown', handleClick)
        }
    }, [])

    //effect, ko se user spremeni
    useEffect(() => {
        const fetchData = async () => {
            // console.log("USER IMAGE: ",user?.image)
            
            //spreminjanje User image z userData
            //ker se lahko zgodi da se User ne posodobi predenj se klice ta koda
            if (user && user.image) {
                try {
                    //image name shranjen v defaultValues.image, poglej ce obstaja na BE
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${user.image}`)
                    //ce response 200-OK, nastavi sliko
                    if (response.ok) {
                        setPreview(response.url)
                    }
                    //sicer nastavi sliko unknown user
                    else {
                        setPreview('images/unknown_user.png')
                    }
                } catch (error) {
                    console.error('Error checking image:', error)
                    setPreview('images/unknown_user.png')
                }
            }
            else {
                setPreview('images/unknown_user.png')
            }

        }
        //fetchData function ter pocakaj da se getUserData izvede (glej Layout)
        fetchData()
    }, [user])

    //effect ko se referenca na header spremeni
    useEffect(() => {
        setRef(headerRef.current)
    }, [setRef]) 

    //toggle user settings popup 
    const togglePopup = () => {
        setShowPopup(!showPopup)
        //console.log(`Visibility status: ${showPopup}`)
    }

    //za odpri/zapri new Auction popup
    const togglePopupAuction = () => {
        refreshUserData()
        setShowAddAuction(!showAddAuction)
        // console.log(`Auction Settings: ${showAddAuction}`)
    }

    return (
        <>
            <header ref={headerRef} className="flex justify-between items-center px-6 py-4 text-white">
                {/* ce je user prijavljen, display Buttons */}
                {user?.email ? (
                    // div z logo, zraven z Buttoni, da so vsi na levi strani (items-start)
                    <>
                        <div className="flex items-center">
                            {/* POZOR: uporabi Link, ker normalni a href unici style novi strani */}
                            <Link to="/">
                                <img src="/images/logo.png" alt="Logo" className="h-12 w-12 rounded-full mr-2" />
                            </Link>
                            {/* background med buttonoma */}
                            <div className="flex items-start bg-white rounded-full p-1">
                                <Link to="/auctions"
                                    // spremeni still glede na current page
                                    className={`rounded-full p-3 mr-2 
                                    ${location.pathname === routes.AUCTIONS
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black'}`}>
                                    {/* svg ikonca zraven teksta */}
                                    <svg className="w-4 h-4 inline-block mr-1 bi bi-house-door" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                                    </svg>
                                    Auction
                                </Link>
                                {/* match = za katerikoli path od /profile/... */}
                                <Link to="/profile"
                                    className={`rounded-full p-3 
                                            ${location.pathname.match(/^\/profile(\/|$)/)
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black'}`}>
                                    {/* svg ikonca zraven teksta */}
                                    <svg className="w-4 h-4 inline-block mr-1 bi bi-person" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                    Profile
                                </Link>
                            </div>
                        </div>
                        {/* Buttoni na desni strani */}
                        <div className="flex items-end bg-white rounded-full pt-1 pl-1 pr-1">
                            {/* levi button */}
                            {/* ko kliknes button, odpri popup */}
                            <button onClick={togglePopupAuction} className="mb-1 mr-1 rounded-full bg-white">
                                <Avatar
                                    size='48'
                                    round
                                    src={'/images/new.png'}
                                    alt="Image" />
                            </button>
                            {/* desni button, preveri vnesenega userja (null-safety) */}
                            {authStore.user && (
                                //container za User settings popup
                                <div className='relative'>
                                    {/* ko kliknes button, odpri popup */}
                                    <button ref={buttonRef} onClick={togglePopup} className="mb-1 rounded-full bg-white">
                                        <Avatar
                                            size='48'
                                            round
                                            src={
                                                preview as string
                                            }
                                            alt="Image" />
                                    </button>
                                    {/* User settings profile popup  */}
                                    {showPopup && (
                                        <div className='settings-popup' ref={popupRef}
                                            style={{
                                                height: `${popupDimensions.height}px`,
                                            }}>
                                            <ProfilePopUp user={user} signout={signout} refreshUserData={refreshUserData} />
                                        </div>
                                    )}
                                    {/* Popup Widget Add Auction */}
                                    {showAddAuction && (
                                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                                            <div className="bg-white rounded-lg p-4">
                                                <AddAuction
                                                    user={user}
                                                    closePopup={togglePopupAuction}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // prikaz ce user ni logged in (logo, login in register buttons)
                    <>
                        <div className="flex items-center">
                            <Link to="/">
                                <img src="/images/logo.png" alt="Logo" className="h-12 w-12 rounded-full mr-2" />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/login" className="text-black font-bold mr-2">Log in</Link>
                            <span className="text-black">or</span>
                            <Link to="/signup" className="ml-2 bg-black px-4 py-2 rounded-2xl">Sign up</Link>
                        </div>
                    </>
                )}
            </header>
        </>
    )

}
export default Header
