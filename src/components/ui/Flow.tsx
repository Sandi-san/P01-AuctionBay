import { FC, ReactNode, useEffect, useState } from 'react';
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
                      image: "image1.jpg",
                      status: "In Stock",
                      date: "2023-05-01"
                    },
                    {
                      name: "Item 2",
                      price: 20,
                      image: "image2.jpg",
                      status: "Out of Stock",
                      date: "2023-05-02"
                    },
                    {
                      name: "Item 3",
                      price: 30,
                      image: "image3.jpg",
                      status: "In Stock",
                      date: "2023-05-03"
                    },
                    {
                      name: "Item 4",
                      price: 40,
                      image: "image4.jpg",
                      status: "Out of Stock",
                      date: "2023-05-04"
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
                            {/* <Card item={item} /> */}
                            
                            <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" />
                            <p className="text-xl font-bold">{item.name}</p>
                            <p className="text-lg">${item.price}</p>
                            <p className="text-sm text-gray-500">{item.status}</p>
                            <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                        <div className="absolute w-full h-2 bg-gradient-to-r from-gray-200 to-transparent bottom-0"></div>
                    </div>
                ))}
            </div >
        </>
    );
};

export default Flow;
