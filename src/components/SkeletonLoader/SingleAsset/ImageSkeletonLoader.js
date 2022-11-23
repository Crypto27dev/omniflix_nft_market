import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const ImageSkeletonLoader = () => {
    return (
        <Skeleton
            animation="wave"
            className="pdf_section_asset skeleton_loader"
            variant="rectangular"/>
    );
};

export default ImageSkeletonLoader;
