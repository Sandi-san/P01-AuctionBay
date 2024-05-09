import { FC, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'

const Loading: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl font-bold animate-pulse">Loading...</p>
        </div>
    )
}
export default Loading
