import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const MoreInfoSkeletonLoader = () => {
    return (
        <Skeleton
            animation="wave"
            className="skeleton_loader"
            height={250}
            width="100%"/>
    );
};

export default MoreInfoSkeletonLoader;
