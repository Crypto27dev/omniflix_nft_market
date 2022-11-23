import React from 'react';
import * as PropTypes from 'prop-types';
import NFTCardSkeletonLoader from './NFTCard';
import CollectionSkeletonLoader from './CollectionSkeletonLoader';
import ActivitySkeletonLoader from './Activity';

const SkeletonLoader = (props) => {
    return (
        Array.from(new Array(10)).map((item, index) => {
            switch (props.type) {
            case 'nft-card':
                return <NFTCardSkeletonLoader key={index}/>;
            case 'collection-card':
                return <CollectionSkeletonLoader key={index}/>;
            case 'activity':
                return <ActivitySkeletonLoader key={index} index={index} start={props.start}/>;
            default:
                break;
            }

            return null;
        })
    );
};

SkeletonLoader.propTypes = {
    type: PropTypes.string.isRequired,
    start: PropTypes.bool,
};

export default SkeletonLoader;
