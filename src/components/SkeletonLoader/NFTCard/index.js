import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const NFTCardSkeletonLoader = () => {
    return (
        <div className="list_page nft_card_skeleton">
            <div className="section1">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={24}
                    width={60}/>
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={24}
                    variant="circular"
                    width={24}/>
            </div>
            <Skeleton
                animation="wave"
                className="list_section2 skeleton_loader"
                variant="rectangular"/>
            <div className="list_section3">
                <div className="list_section3_div">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="100%"/>
                </div>
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={24}
                    width="80%"/>
            </div>
            <div className="list_border"/>
            <div className="list_section4">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={43}
                    width="100%"/>
            </div>
        </div>
    );
};

export default NFTCardSkeletonLoader;
