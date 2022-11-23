import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideActiveCard, showActiveCard } from '../../../actions/explore';
import { hideFilters } from '../../../actions/filters';
import ClassNames from 'classnames';
import { withRouter } from 'react-router';
import variables from '../../../utils/variables';
import thumbnail from '../../../assets/collections/thumbnail.svg';
import NoData from '../../../components/NoData';
import ImageOnLoad from '../../../components/ImageOnLoad/BackgroundImage';
import { Tooltip } from '@mui/material';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import VideoOnLoad from '../../../components/ImageOnLoad/VideoOnLoad';

const CollectionList = (props) => {
    const { hideActiveCard } = props;

    useEffect(() => {
        hideActiveCard();
        document.body.style.overflow = null;
        const elements = document.getElementsByClassName('scroll_bar');

        for (let i = 0, len = elements.length; i < len; i++) {
            elements[i].style.overflow = 'unset';
        }
    }, [hideActiveCard]);

    const handleReDirect = (event) => {
        event.stopPropagation();
        if (props.showActive) {
            props.hideActiveCard();
        }
    };

    return (
        <>
            {props.collections && props.collections.length > 0
                ? props.collections.map((item) => {
                    const mediaType = item && item.media_type;

                    return (
                        <div
                            key={item.id}
                            className={ClassNames('list_page', (props.activeValue) === (item && item.id) ? 'active' : '')}>
                            <a
                                href={'/collection/' + (item && item.id)}
                                rel="no-refresh"
                                onClick={handleReDirect}>
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
                                            className="list_section2"
                                            src={item && item.preview_uri ? item.preview_uri : thumbnail}/>
                                        : <ImageOnLoad
                                            cdn={item && item.cloudflare_cdn && item.cloudflare_cdn.variants}
                                            className="list_section2"
                                            src={item && item.preview_uri ? item.preview_uri : thumbnail}/>}
                                <div className="row">
                                    <div className="list_section3">
                                        <div className="list_section3_div">
                                            <span>
                                                {variables[props.lang].collection}
                                            </span>
                                        </div>
                                        <Tooltip title={(item && item.name) + ' | ' + (item && item.symbol)}>
                                            <span className="list_section3_span">
                                                {item && item.name}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div className="list_section3">
                                        <div className="list_section3_div">
                                            <span>
                                                {variables[props.lang].nfts}
                                            </span>
                                        </div>
                                        <span className="list_section3_span">
                                            {item.owned_nfts}
                                            /{item.total_nfts}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    );
                }) : <NoData/>}
        </>
    );
};

CollectionList.propTypes = {
    collections: PropTypes.array.isRequired,
    collectionsTotal: PropTypes.number.isRequired,

    filterShow: PropTypes.bool.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        filterShow: state.filters.show,
        showActive: state.explore.activeCard.open,
        activeValue: state.explore.activeCard.activeNFTID,

        collections: state.myAccount.userCollections.result,
        collectionsTotal: state.myAccount.userCollections.count,
    };
};

const actionToProps = {
    show: showActiveCard,
    hideFilters,
    hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(CollectionList));
