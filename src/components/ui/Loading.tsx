import { FC } from 'react'

//CUSTOM STYLE PAGE KO SE ELEMENTI IZ BACKEND SE NALAGAJO 
const Loading: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl font-bold animate-pulse">Loading...</p>
        </div>
    )
}
export default Loading
