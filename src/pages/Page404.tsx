import { FC } from 'react'
import { Link } from 'react-router-dom'

//404 NOT FOUND PAGE (prikazi ce page ne obstaja)
const Page404: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">
                Nothing found <span className="text-red-500">404</span>!
            </h1>
            <Link to="/" className="text-blue-500 hover:underline">Go home</Link>
        </div>
    )
}

export default Page404
