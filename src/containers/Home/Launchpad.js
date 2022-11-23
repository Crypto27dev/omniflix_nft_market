import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import genesisCreatorIcon from '../../assets/diamond.svg';
import NoData from '../../components/NoData';
import { withRouter } from 'react-router';
import ImageOnLoad from '../../components/ImageOnLoad';
import thumbnail from '../../assets/collections/thumbnail.svg';
import { randomNoRepeats } from '../../utils/arrays';
import { Tooltip } from '@mui/material';
import variables from '../../utils/variables';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import { Button } from '@material-ui/core';

const Collections = (props) => {
    const handleMint = (event, url) => {
        event.stopPropagation();
        event.preventDefault();
        window.open(url);
    };

    const randomList = props.launchpadCollections && props.launchpadCollections.length > 0 &&
        randomNoRepeats(props.launchpadCollections);

    return (
        <div className="genesis_creator_collections launchpad_list">
            {randomList && randomList.length > 0
                ? randomList.map((item, index) => {
                    const mediaType = item && item.media_type;

                    if (index < 12) {
                        return (
                            <a
                                key={index}
                                className="genesis_creator_collection" href={item && item.app_url}
                                onClick={(e) => handleMint(e, item.app_url)}>
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
                                            className=""
                                            src={item && item.preview_uri ? item.preview_uri : thumbnail}/>
                                        : <ImageOnLoad
                                            cdn={item && item.cloudflare_cdn && item.cloudflare_cdn.variants}
                                            className=""
                                            src={item && item.preview_uri ? item.preview_uri : thumbnail}/>}
                                {item && item.IP_infringement
                                    ? <div className="copy_right">
                                        <div className="copy_right_icon">
                                            <CopyRight/>
                                        </div>
                                        <div className="copy_right_content">
                                            <CopyRight/>
                                            <span>{variables[props.lang]['cr_collection_card']}</span>
                                        </div>
                                    </div>
                                    : item && item.verified
                                        ? <Tooltip title={variables[props.lang]['genesis_creator']}>
                                            <div className="genesis_creator">
                                                <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                            </div>
                                        </Tooltip> : null}
                                <div className="details">
                                    <p>{item && (item.name || item.symbol)}</p>
                                    <Button
                                        className="secondary_button"
                                        onClick={(e) => handleMint(e, item.app_url)}>
                                        {variables[props.lang].mint}
                                    </Button>
                                </div>
                            </a>
                        );
                    }

                    return null;
                }) : <NoData/>}
        </div>
    );
};

Collections.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    launchpadCollections: PropTypes.array.isRequired,
    launchpadCollectionsInProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        launchpadCollections: state.home.launchpadCollections.result,
        launchpadCollectionsInProgress: state.home.launchpadCollections.inProgress,
    };
};

export default withRouter(connect(stateToProps)(Collections));
