import React from 'react';
import './index.css';

const DotsLoading = (props) => {
    return (
        <div className="spinner" {...props}>
            <div className="bounce1"/>
            <div className="bounce2"/>
            <div className="bounce3"/>
        </div>
    );
};

export default DotsLoading;
