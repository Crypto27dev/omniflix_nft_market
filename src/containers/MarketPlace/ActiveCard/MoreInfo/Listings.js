import React from 'react';
import { Button } from '@mui/material';

const Listings = () => {
    const data = [{
        price: '5500',
        expiration: '3 hours',
        address: 'omniflix1jpudqpydw26r3297dlaj3whecvatyayklk4k9e',
    }, {
        price: '6900',
        expiration: 'Expired',
        address: 'omniflix1jpudqpydw26r3297dlaj3whecvatyayklk4k9e',
    }, {
        price: '6900',
        expiration: 'Expired',
        address: 'omniflix1jpudqpydw26r3297dlaj3whecvatyayklk4k9e',
    }];

    return (
        <div className="listing_table">
            <div className="listing_header">
                <span> Listing Price</span>
                <span> Expiration</span>
                <span> From</span>
                <span> Action</span>
            </div>
            <div className="listing_data">
                {
                    data.map((item, index) => (
                        <div key={index}>
                            <div className="listing_price">
                                {item.price}
                                <span> FLIX</span>
                            </div>
                            <div className="expiration"> {item.expiration}</div>
                            <div className="from_value hash_text" title={item.address}>
                                <p className="name">{item.address}</p>
                                {item.address.slice(item.address.length - 4, item.address.length)}
                            </div>
                            <Button className="action">
                                Buy
                            </Button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Listings;
