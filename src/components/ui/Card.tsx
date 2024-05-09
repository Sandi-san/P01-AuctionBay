import { FC, ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'
import '../../styles.css'

//definiraj variable Itema/Carda
interface Item {
    name: string;
    price: number;
    image: string;
    status: string;
    date: string;
}

//shrani item v Props
interface Props {
    item: Item;
}

const Card: FC<Props> = ({ item }) => {
    // destruct props v posamezni var
    const { name, price, image, status, date } = item

    return (
        <div className="h-[250px] w-[216px] bg-white rounded-2xl flex flex-col overflow-hidden">
            {/* Content section */}
            <div className="pt-2 pr-2 pl-2 pb-1">
                {/* Tag header section */}
                <div className="flex justify-between mb-2">
                    {/* left tag: status */}
                    <span className="bg-gray-200 py-1 px-2 rounded-full text-xs">{status}</span>
                    {/* right tag: date */}
                    <span className="bg-gray-200 py-1 px-2 rounded-full text-xs">{date}</span>
                </div>

                {/* Title section */}
                <div className="flex flex-col items-start mb-2">
                    <p className="text-lg text-color-primary">{name}</p>
                </div>

                {/* Price section */}
                <div className="flex flex-col items-start">
                    <p className="text-color-primary font-bold font-medium text-16 leading-24">{price}€</p>
                </div>
            </div>

            {/* Image container */}
            <div className="flex justify-center items-center overflow-hidden h-full">
                <img src={image} alt="Product" className="rounded-xl object-cover h-full w-full p-2" />
            </div>
        </div>
    );
}
export default Card
