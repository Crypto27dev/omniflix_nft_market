import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import thumbnail from '../../../assets/collections/thumbnail.svg';
import CircularProgress from '../../../components/CircularProgress';
import NoData from '../../../components/NoData';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import VideoOnLoad from '../../../components/ImageOnLoad/VideoOnLoad';
import ImageOnLoad from '../../../components/ImageOnLoad';

const Collections = (props) => {
    return (
        <div className="cards_content">
            {props.collectionsInProgress
                ? <CircularProgress/>
                : props.collections && props.collections.length > 0
                    ? props.collections.map((item, index) => {
                        if (index <= 5) {
                            const mediaType = item && item.media_type;

                            return (
                                <div key={index} className="card">
                                    {mediaType &&
                                    getAssetType(mediaType) === 'video'
                                        ? <div className="inline_video_section">
                                            <VideoOnLoad
                                                src={item && item.preview_uri}
                                                type={mediaType}/>
                                        </div>
                                        : mediaType &&
                                        getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                            ? <ImageOnLoad
                                                src={item && item.preview_uri ? item.preview_uri : thumbnail}/>
                                            : <ImageOnLoad
                                                cdn={item && item.cloudflare_cdn && item.cloudflare_cdn.variants}
                                                src={item && item.preview_uri ? item.preview_uri : thumbnail}/>}
                                    <div className="info">
                                        <p className="name1">{item.name || item.symbol}</p>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })
                    : <NoData/>}
        </div>
    );
};

Collections.propTypes = {
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        collections: state.myAccount.ownerCollections.result,
        collectionsInProgress: state.myAccount.ownerCollections.inProgress,
    };
};

export default connect(stateToProps)(Collections);
