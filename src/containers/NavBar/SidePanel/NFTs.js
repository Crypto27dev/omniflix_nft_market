import React from 'react';
import * as PropTypes from 'prop-types';
import NoData from '../../../components/NoData';
import DotsLoading from '../../../components/DotsLoading';
import { connect } from 'react-redux';
import thumbnail from '../../../assets/collections/thumbnail.svg';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import VideoOnLoad from '../../../components/ImageOnLoad/VideoOnLoad';
import ImageOnLoad from '../../../components/ImageOnLoad';

const NFTs = (props) => {
    const handleMouseOver = (event) => {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.play();
        }
    };

    const handleMouseOut = (event) => {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.pause();
        }
    };

    return (
        <div className="cards_content">
            {props.nftSInProgress
                ? <DotsLoading/>
                : props.nftSList && props.nftSList.length
                    ? props.nftSList.map((item, index) => {
                        if (index <= 5) {
                            const mediaType = item && item.media_type;

                            return (
                                <div
                                    key={index}
                                    className="card"
                                    onMouseOut={handleMouseOut}
                                    onMouseOver={handleMouseOver}>
                                    {mediaType &&
                                        getAssetType(mediaType) === 'video'
                                        ? <div className="inline_video_section">
                                            <VideoOnLoad
                                                preview={item.preview_uri || thumbnail}
                                                src={item && item.media_uri}
                                                type={mediaType}/>
                                        </div>
                                        : mediaType &&
                                            getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                            ? <ImageOnLoad
                                                preview={item && item.preview_uri ? item.preview_uri : thumbnail}
                                                src={item && item.media_uri ? item.media_uri : thumbnail}/>
                                            : <ImageOnLoad
                                                cdn={item && item.cloudflare_cdn && item.cloudflare_cdn.variants}
                                                preview={item && item.preview_uri ? item.preview_uri : thumbnail}
                                                src={item && item.media_uri ? item.media_uri : thumbnail}/>}
                                    <div className="info">
                                        <p className="name1">{item.denom_id && item.denom_id.name}</p>
                                        <p className="name2">{item && item.name}</p>
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    },
                    ) : <NoData/>}
        </div>
    );
};

NFTs.propTypes = {
    nftSInProgress: PropTypes.bool.isRequired,
    nftSList: PropTypes.array.isRequired,
};

const stateToProps = (state) => {
    return {
        nftSList: state.myAccount.ownerNFTs.result,
        nftSInProgress: state.myAccount.ownerNFTs.inProgress,
    };
};

export default connect(stateToProps)(NFTs);
