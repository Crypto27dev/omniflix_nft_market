import React from 'react';
import '../index.css';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const CardSkeletonLoader = () => {
    return (
        <div className="single_asset_details card_skeleton">
            <Skeleton
                animation="wave"
                className="skeleton_loader"
                height={30}
                width="100%"/>
            <div className="list_section1">
                <div className="list_section1_left">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width={60}/>
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        variant="circular"
                        width={26}/>
                </div>
                <div className="list_section1_right">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        variant="circular"
                        width={26}/>
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        variant="circular"
                        width={26}/>
                </div>
            </div>
            <div className="list_section3">
                <Skeleton
                    animation="wave"
                    className="skeleton_loader"
                    height={24}
                    width="80%"/>
            </div>
            <div className="active_card_section4">
                <div className="section4_row1">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={26}
                        width="100%"/>
                </div>
                <div className="section4_row2">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={60}
                        width="100%"/>
                </div>
                <div className="more_info">
                    <Skeleton
                        animation="wave"
                        className="skeleton_loader"
                        height={250}
                        width="100%"/>
                </div>
            </div>
        </div>
    );
};

export default CardSkeletonLoader;
