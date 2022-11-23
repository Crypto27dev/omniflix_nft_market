import React from 'react';
import './index.css';
import SelectTokenSelectField from './SelectTokenSelectField';
import PriceTextField from './PriceTextField';

const ChoosePrice = () => {
    return (
        <div className="choose_price">
            <SelectTokenSelectField/>
            <PriceTextField/>
        </div>
    );
};

export default ChoosePrice;
