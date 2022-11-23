import React from 'react';
import '../index.css';
import Skeleton from '@mui/material/Skeleton';

const ImageSkeletonLoader = () => {
    return (
        <Skeleton
            animation="wave"
            className="collection_icon skeleton_loader"
            variant="rectangular"/>
    );
};

export default ImageSkeletonLoader;
