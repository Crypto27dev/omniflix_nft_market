import React from 'react';
import comingSoonIcon from '../../assets/auction/comingSoon.svg';
import './index.css';

const ComingSoon = () => {
    return (
        <div className="no_data">
            <img alt="coming soon" src={comingSoonIcon}/>
        </div>
    );
};

export default ComingSoon;
