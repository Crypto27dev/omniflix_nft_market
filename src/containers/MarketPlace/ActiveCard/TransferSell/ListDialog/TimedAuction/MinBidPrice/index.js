import React from 'react';
import './index.css';
import SelectTokenSelectField from '../../ChoosePrice/SelectTokenSelectField';
import PriceTextField from '../../ChoosePrice/PriceTextField';

const MinBidPrice = () => {
    return (
        <div className="choose_price min_bid_price">
            <SelectTokenSelectField/>
            <PriceTextField defaultValue="0"/>
        </div>
    );
};

export default MinBidPrice;
