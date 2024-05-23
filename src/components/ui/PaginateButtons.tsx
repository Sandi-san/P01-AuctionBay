import { FC } from 'react'

interface Props {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

//STYLE PAGINATED GUMBOV PRI AUCTIONS/PROFILE PAGEIH
const PaginateButtons: FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <>
            {/* Pagination controls: First/Last, Next/Prev buttoni in page info */}
            <div className="flex justify-center pb-2 bg-gray-100">
                <button
                    className={`mx-1 px-4 py-2 rounded-xl 
            ${currentPage === 1 ? 'bg-gray-300 hover:cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}>
                    First
                </button>
                <button
                    className={`mx-1 px-4 py-2 rounded-xl 
            ${currentPage === 1 ? 'bg-gray-300 hover:cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Previous
                </button>
                <span className="mx-1 px-4 py-2 rounded-xl">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`mx-1 px-4 py-2 rounded-xl 
            ${currentPage === totalPages ? 'bg-gray-300 hover:cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
                <button
                    className={`mx-1 px-4 py-2 rounded-xl 
            ${currentPage === totalPages ? 'bg-gray-300 hover:cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}>
                    Last
                </button>
            </div>
        </>
    )
}
export default PaginateButtons
