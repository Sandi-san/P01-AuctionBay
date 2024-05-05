import { FC, useState } from 'react'
import '../../styles.css'

import { Link } from 'react-router-dom'

const Header: FC = () => {
    return (
        <>
            <header className="flex justify-between items-center px-4 py-2 text-white">
                <div className="flex items-center">
                    <img src="/Logo.png" alt="Logo" className="h-8 w-8 rounded-full mr-2" />
                    <span className="text-lg text-black font-bold">AuctionBay</span>
                </div>
                <div className="flex items-center">
                    <Link to="/login" className="text-black font-bold mr-4">Log in</Link>
                    <span className="text-black">or</span>
                    <Link to="/register" className="ml-4 bg-black px-4 py-2 rounded-md">Sign up</Link>
                </div>
            </header>
        </>
    )
}
/*
import { StatusCode } from 'constants/errorConstants'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { useNavigate } from 'react-router-dom'

import * as API from 'api/Api'
import useMediaQuery from 'hooks/useMediaQuery'
import authStore from 'stores/auth.store'
import { routes } from 'constants/routesConstants'
import Avatar from 'react-avatar'
import Button from 'react-bootstrap/Button'

const Header: FC = () => {
    //custom hook iz /hooks
    const { isMobile } = useMediaQuery(768)
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
                            <strong className="me-auto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>
    )
}
*/
export default Header
