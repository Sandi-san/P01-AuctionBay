import { FC, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'
import ProfilePopUp from '../ui/ProfilePopUp'
import 'reactjs-popup/dist/index.css';

const Header: FC = () => {
    //za User settings popup
    //ali je Popup odprt ali ne
    const [showPopup, setShowPopup] = useState(false);
    //dimenzije popupa (za pravilne dimenzije parenta)
    const [popupDimensions, setPopupDimensions] = useState({ width: 0, height: 0 });
    //referenca na Popup element
    const popupRef = useRef<HTMLDivElement | null>(null);
    //referenca na Button element ki odpre Popup
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    //effect, ki je na strani
    useEffect(() => {
        //click kjerkoli na screenu
        const handleClick = (event: MouseEvent) => {
            // setButtonClicked(false)

            //check ce je click v buttonu, ki odpre Popup (potrebno za pravilni toggle)
            if (buttonRef.current && event.target instanceof Node && buttonRef.current.contains(event.target)) {
                console.log("Clicked on button")
                //potrebni koncat izvajanje funk, da se toggle pravilno obnasa
                return
            }
            //check ce je click v Popup formu (ko je ze odprt)
            else if (popupRef.current && event.target instanceof Node && popupRef.current.contains(event.target)) {
                console.log("Click in")
                const { width, height } = popupRef.current.getBoundingClientRect();
                setPopupDimensions({ width, height });
                return;
            }
            else {
                //click izven Popup
                setShowPopup(false);
            }
        };
        //dodaj listener ko se nalozi page
        document.addEventListener('mousedown', handleClick);
        return () => {
            //odstrani listener ko se page zapre
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const togglePopup = () => {
        setShowPopup(!showPopup);
        console.log(`Visibility status: ${showPopup}`)
    };

    //za preverjanje na kateri strani smo (spremninjanje button stilov (Auction/Profile))
    const location = useLocation();
    const currentPage = location.pathname;

    //za error prikazovanje (Toast)
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    return (
        <>
            <header className="flex justify-between items-center px-6 py-4 text-white">
                {/* ce je user prijavljen, display Buttons */}
                {authStore.user ? (
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
                                    ${currentPage === '/auctions'
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black'}`}>
                                    {/* svg ikonca zraven teksta */}
                                    <svg className="w-4 h-4 inline-block mr-1 bi bi-house-door" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                                    </svg>
                                    Auction
                                </Link>
                                <Link to="/profile"
                                    className={`rounded-full p-3 
                                            ${currentPage === '/profile'
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
                            <Link to="/new_auction">
                                <button className="rounded-full bg-white mr-2">
                                    <img src="/images/new.png" alt="Add new auction"
                                        className="h-12 w-12" />
                                </button>
                            </Link>
                            {/* desni button, preveri vnesenega userja (null-safety) */}
                            {authStore.user && (
                                //container za User settings popup
                                <div className='relative'>
                                    {/* ko kliknes button, odpri popup */}
                                    <button ref={buttonRef} onClick={togglePopup} className="rounded-full bg-white">
                                        <img
                                            src={authStore.user.avatar || '/images/unknown_user.png'}
                                            alt={
                                                authStore.user?.first_name || authStore.user?.last_name
                                                    ? `${authStore.user?.first_name} ${authStore.user?.last_name}`
                                                    : authStore.user?.email
                                            }
                                            className="h-12 w-12"
                                        />
                                    </button>
                                    {/* User settings profile popup  */}
                                    {showPopup && (
                                        <div className='settings-popup' ref={popupRef}
                                            style={{
                                                height: `${popupDimensions.height}px`,
                                            }}>
                                            <ProfilePopUp />
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
/*
import {StatusCode} from 'constants/errorConstants'
            import Toast from 'react-bootstrap/Toast'
            import ToastContainer from 'react-bootstrap/ToastContainer'
            import {useNavigate} from 'react-router-dom'

            import * as API from 'api/Api'
            import useMediaQuery from 'hooks/useMediaQuery'
            import authStore from 'stores/auth.store'
            import {routes} from 'constants/routesConstants'
            import Avatar from 'react-avatar'
            import Button from 'react-bootstrap/Button'

const Header: FC = () => {
    //custom hook iz /hooks
    const {isMobile} = useMediaQuery(768)
            const navigate = useNavigate()

            const [apiError, setApiError] = useState('')
            const [showError, setShowError] = useState(false)

    const signout = async () => {
        const response = await API.signout()
            if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(response.data.message)
            setShowError(true)
        } else {
                authStore.signout()
            navigate('/')
        }
    }

            return (
            <>
                <div className="topbar d-flex flex-grow-1 justify-content-end align-items-center bg-dark px-3 py-2">
                    <div>
                        <Link
                            className="btn btn-dark text-decoration-none text-light me-3"
                            to={`${routes.DASHBOARD_PREFIX}/users/edit`}
                            state={{
                                id: authStore.user?.id,
                                first_name: authStore.user?.first_name,
                                last_name: authStore.user?.last_name,
                                email: authStore.user?.email,
                                role_id: authStore.user?.role?.id,
                                avatar: authStore.user?.avatar,
                                isActiveUser: true,
                            }}
                        >
                            <Avatar
                                className="topbar__avatar"
                                round
                                src={`${process.env.REACT_APP_API_URL}/files/${authStore.user?.avatar}`}
                                alt={
                                    authStore.user?.first_name || authStore.user?.last_name
                                        ? `${authStore.user?.first_name} ${authStore.user?.last_name}`
                                        : authStore.user?.email
                                }
                            />
                        </Link>

                        <Button className="btn-dark me-3" onClick={signout}>
                            Sign out
                        </Button>
                        <Link className="btn btn-dark" to={routes.HOME}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-house-door-fill"
                                viewBox="0 0 16 16"
                            >
                                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                            </svg>
                        </Link>
                    </div>
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
            */
export default Header
