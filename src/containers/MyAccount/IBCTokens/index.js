import Table from './Table';
import './index.css';
import React, { useEffect } from 'react';
import DepositDialog from './DepositeDialog';
import WithDrawDialog from './WithDrawDialog';

const IBCTokens = () => {
    useEffect(() => {
        document.body.style.overflow = null;
    }, []);

    return (
        <>
            <Table/>
            <DepositDialog/>
            <WithDrawDialog/>
        </>
    );
};

export default IBCTokens;
