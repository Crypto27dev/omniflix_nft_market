import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const MyAccountSkeletonLoader = () => {
    return (
        <div className="my_account_skeleton">
            <Skeleton
                animation="wave"
                className="skeleton_loader"
                height={26}
                width="60%"/>
            <Skeleton
                animation="wave"
                className="skeleton_address skeleton_loader"
                height={43}
                width="100%"/>
        </div>
    );
};

export default MyAccountSkeletonLoader;
