import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const CollectionInfoSkeletonLoader = () => {
    return (
        <div className="collections collection_skeleton">
            <div className="collection_profile">
                <div className="image_section">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={80}
                        variant="circular"
                        width={80}/>
                </div>
                <div className="text_section">
                    <div className="text_section1">
                        <Skeleton
                            animation="wave"
                            className="skeleton_loader"
                            height={26}
                            width="80%"/>
                    </div>
                    <div className="text_section2">
                        <Skeleton
                            animation="wave"
                            className="skeleton_loader"
                            height={26}
                            width="100%"/>
                    </div>
                </div>
            </div>
            <div className="items_count">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={26}
                    width="50%"/>
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={26}
                    width="50%"/>
            </div>
            <div className="collection_section2">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={60}
                    width="100%"/>
            </div>
            <div className="traded_floor_price">
                <div className="total_tokens_traded">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="60%"/>
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={60}
                        width="60%"/>
                </div>
                <div className="total_tokens_traded">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="60%"/>
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={60}
                        width="60%"/>
                </div>
            </div>
        </div>
    );
};

export default CollectionInfoSkeletonLoader;
