import { FC, useState } from 'react'
import 'reactjs-popup/dist/index.css'
import { useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { Button } from 'react-bootstrap'
import ProfileSettings from './ProfileSettings'
import ProfilePassword from './ProfilePassword'
import ProfileImage from './ProfileImage'
import { UserType } from '../../models/auth'

interface Props {
    //passaj user (iz setUser) da lahko accesas variable ki vrni /me iz BE
    user: UserType | null
    //passaj parent funkcijo, s katero se signoutas
    signout: () => Promise<void>
    //passaj funkcijo, ki ponovno pridobi (refresha) info od userja iz BE (/me)
    refreshUserData: () => Promise<void>
}

const ProfilePopUp: FC<Props> = ({ user, signout, refreshUserData }) => {
    //za error prikazovanje (Toast)
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    //za vse tri Popup forme (Settings, Password, Avatar)
    const [showPopupSettings, setShowPopupSettings] = useState(false)
    const [showPopupPassword, setShowPopupPassword] = useState(false)
    const [showPopupImage, setShowPopupImage] = useState(false)

    const togglePopupSettings = () => {
        //ko znova odpremo Profile popup, znova fetchaj userja (parent funkc)
        refreshUserData()
        setShowPopupSettings(!showPopupSettings)
        // console.log(`Showed Settings: ${showPopupSettings}`)
    }
    const togglePopupPassword = () => {
        setShowPopupPassword(!showPopupPassword)
        // console.log(`Showed Password: ${showPopupPassword}`)
    }
    const togglePopupImage = () => {
        setShowPopupImage(!showPopupImage)
        // console.log(`Showed Image: ${showPopupImage}`)
    }

    return (
        <>
            <div className="mt-2 w-52 bg-white rounded-lg shadow-2xl p-4 flex flex-col items-center justify-center font-semibold">
                {/* Profile settings link */}
                <Button onClick={togglePopupSettings} className="text-black flex items-center mb-4">
                    <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                    </svg>
                    <span className="text-black">Profile Settings</span>
                </Button>

                {/* Popup Widget User Settings */}
                {showPopupSettings && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-4">
                            <ProfileSettings
                                user={user}
                                closePopup={togglePopupSettings}
                                openPopupPassword={togglePopupPassword}
                                openPopupImage={togglePopupImage}
                            />
                        </div>
                    </div>
                )}

                {/* Popup Widget Password */}
                {showPopupPassword && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-4">
                            <ProfilePassword
                                user={user}
                                closePopup={togglePopupPassword}
                            />
                        </div>
                    </div>
                )}

                {/* Popup Widget Image */}
                {showPopupImage && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg p-4">
                            <ProfileImage
                                user={user}
                                closePopup={togglePopupImage}
                            />
                        </div>
                    </div>
                )}

                {/* Logout button */}
                <button
                    className="text-gray-900 border border-black bg-white custom-button w-full"
                    onClick={signout}
                >
                    Logout
                </button>
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
export default ProfilePopUp