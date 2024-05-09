import { FC, ReactNode, useEffect, useState } from 'react';
import Card from './Card';
import Loading from './Loading';
//import { fetchItemsFromBackend } from 'backend-api'; // TODO: Import backend API function

interface Item {
    name: string;
    price: number;
    image: string;
    status: string;
    date: string;
}

const Flow: FC = () => {
    //itemi (Auctioni) ki jih dobis iz db za prikaz
    const [items, setItems] = useState<Item[]>([]);

    //page se se nalaga?
    const [loading, setLoading] = useState(true);

    //dobi data iz api ko se komponenta nalozi
    useEffect(() => {
        const fetchData = async () => {
            try {
                //klic API class, ki dobi 4 trenutne auctione iz baze
                // const data = await TODO();


                //SAMO Z TEMPLATE PODATKI
                //cakaj nekaj casa da se lahko izvede funkcija predenj renderiras page 
                await new Promise(resolve => setTimeout(resolve, 100));

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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); //funkcijo zazeni le ob zacetku

    //ce se se page loada
    if (loading) {
        return <Loading/>
    }

    return (
        <>
            {/* justify, continer = center horizontal */}
            <div className="container mx-auto flex justify-center items-center h-screen">
                {/* ustvari grid kjer so elementi skupaj v centru */}
                <div className="grid grid-cols-2 gap-4">
                    {/* izrisi vsak card posebej (da bodo pravilno postavljeni) */}
                    {/* dodaj custom drop shadow gradient, rounded corners kot v Card widgetu, sicer ni pravilni color pri cornerjih */}
                    <div className="relative overflow-hidden rounded-2xl shadow-gradient">
                        <Card item={items[0]} />
                    </div>
                    {/* Second card */}
                    <div className="relative overflow-hidden rounded-2xl shadow-gradient">
                        <Card item={items[1]} />
                    </div>
                    {/* Third card */}
                    <div className="relative overflow-hidden rounded-2xl shadow-gradient">
                        <Card item={items[2]} />
                    </div>
                    {/* Fourth card */}
                    <div className="relative overflow-hidden rounded-2xl shadow-gradient">
                        <Card item={items[3]} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Flow;
