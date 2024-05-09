import { FC, ReactNode, useEffect, useState } from 'react';
import Card from './Card';
//import { fetchItemsFromBackend } from 'backend-api'; // TODO: Import backend API function

interface Item {
    name: string;
    price: number;
    image: string;
    status: string;
    date: string;
}

const Flow: FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    //dobi data iz api ko se komponenta nalozi
    useEffect(() => {
        const fetchData = async () => {
            try {
                //klic API class, ki dobi 4 trenutne auctione iz baze
                // const data = await TODO();

                const data: Item[] = [
                    {
                        name: "Item 1",
                        price: 10,
                        image: "images/landing_page_preview.png",
                        status: "In progress",
                        date: "59m"
                    },
                    {
                        name: "Item 2",
                        price: 20,
                        image: "images/landing_page_preview.png",
                        status: "In progress",
                        date: "1h"
                    },
                    {
                        name: "Item 3",
                        price: 30,
                        image: "images/test.png",
                        status: "In progress",
                        date: "7h"
                    },
                    {
                        name: "Item 4",
                        price: 40,
                        image: "images/new.png",
                        status: "In progress",
                        date: "12h"
                    }
                ];

                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchData();
    }, []); //zazeni le ob zacetku

    return (
        <>
            {/* continer = center horizontal */}
            {/* flex-wrap, justify = responzivni container, center horizontal */}
            <div className="container mx-auto flex flex-wrap justify-center">
                {/* mapiraj vsako (4) karto (auction) v 2x2 grid */}
                {items.map((item, index) => (
                    <div key={index} className="w-64 h-64 flex items-center justify-center m-4 relative">
                        <div>
                            {/* renderiraj karto z podatki iz Item */}
                            <Card item={item} />
                        </div>
                    </div>
                ))}
            </div >
        </>
    );
};

export default Flow;
