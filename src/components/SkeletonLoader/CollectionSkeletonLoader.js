import React from 'react';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const CollectionSkeletonLoader = () => {
    return (
        <div className="list_page collection_skeleton_loader">
            <Skeleton
                animation="wave"
                className="list_section2 skeleton_loader"
                variant="rectangular"/>
            <div className="row">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={26}
                    width="100%"/>
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={24}
                    width="80%"/>
            </div>
        </div>
    );
};

export default CollectionSkeletonLoader;
