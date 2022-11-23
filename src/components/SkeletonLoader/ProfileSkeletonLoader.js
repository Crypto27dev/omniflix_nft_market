import React from 'react';
import './index.css';
import Skeleton from '@mui/material/Skeleton';

const ProfileSkeletonLoader = () => {
    return (
        <div className="profile_skeleton">
            <Skeleton
                animation="wave"
                className="skeleton_loader"
                height={50}
                width={140}/>
        </div>
    );
};

export default ProfileSkeletonLoader;
