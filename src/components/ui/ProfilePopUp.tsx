import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PopupForm = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (

        <div className="absolute top-0 right-0 mt-12 w-64 bg-white rounded-lg shadow-md p-4">
            {/* Profile settings link */}
            <div className="flex items-center mb-4">
                <svg
                    className="w-5 h-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                <Link to="/profile_settings" className="text-blue-500">
                    Profile Settings
                </Link>
            </div>

            {/* Logout button */}
            <button
                className="bg-red-500 text-white px-4 py-2 rounded focus:outline-none"
                onClick={() => {
                    // Add logout functionality here
                    console.log('Logout clicked');
                }}
            >
                Logout
            </button>
        </div>
    )
}