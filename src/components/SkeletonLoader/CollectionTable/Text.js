import React from 'react';
import '../index.css';
import Skeleton from '@mui/material/Skeleton';
import * as PropTypes from 'prop-types';

const TextSkeletonLoader = (props) => {
    return (
        <Skeleton
            animation="wave"
            className="skeleton_loader"
            height={26}
            width={props.width || 70}/>
    );
};

TextSkeletonLoader.propTypes = {
    width: PropTypes.number,
};

export default TextSkeletonLoader;
