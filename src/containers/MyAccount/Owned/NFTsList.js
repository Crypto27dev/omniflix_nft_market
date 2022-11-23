import React, { useEffect } from 'react';
// import moreIcon from '../../../assets/explore/more.svg';
import arrowIcon from '../../../assets/explore/transferability.svg';
import * as PropTypes from 'prop-types';
import variables from '../../../utils/variables';
import { hideActiveCard, showActiveCard } from '../../../actions/explore';
import { hideFilters } from '../../../actions/filters';
import ClassNames from 'classnames';
import NoData from '../../../components/NoData';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ImageOnLoad from '../../../components/ImageOnLoad/BackgroundImage';
import { tokensList } from '../../../utils/defaultOptions';
import { config } from '../../../config';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import { formatCount } from '../../../utils/price';
import genesisCreatorIcon from '../../../assets/diamond.svg';
import { Tooltip } from '@mui/material';
import VideoOnLoad from '../../../components/ImageOnLoad/VideoOnLoad';
import { ReactComponent as CopyRight } from '../../../assets/copy-right.svg';
import Card from '../../MarketPlace/Auctions/Card';
import moreIcon from '../../../assets/explore/more.svg';
import { showMenuPopover } from '../../../actions/marketplace';

const NFTsList = (props) => {
    const { hideActiveCard } = props;

    useEffect(() => {
        hideActiveCard();
        document.body.style.overflow = null;
    }, [hideActiveCard]);

    const handleShow = (value, event) => {
        let card = event.target;
        if (!event.target.classList.contains('list_page')) {
            card = event.target.closest('.list_page');
        }
        if (!props.showActive) {
            card && card.scrollIntoView();
        } else {
            window.scrollTo({
                top: (card && card.offsetTop) + 190,
                behavior: 'smooth',
            });
        }

        if (props.filterShow) {
            props.hideFilters();
        }

        props.show(value);
    };

    const handleReDirect = (event) => {
        event.stopPropagation();
        if (props.showActive) {
            props.hideActiveCard();
        }
    };

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

    const handleMoreOptions = (event, item) => {
        event.stopPropagation();
        props.showMenuPopover(event, item);
    };

    return (
        <>
            {props.nftSList && props.nftSList.length
                ? props.nftSList.map((item, index) => {
                    const tokenType = item && item.list && item.list.price && item.list.price.denom &&
                        tokensList.find((val) => val.value === item.list.price.denom);
                    const ibcToken = item.list && item.list.price && item.list.price.denom &&
                        props.ibcTokensList && props.ibcTokensList.length &&
                        props.ibcTokensList.find((val) =>
                            val && val.ibc_denom_hash && (val.ibc_denom_hash === item.list.price.denom));
                    const mediaType = item && item.media_type;
                    let auction = { ...item };
                    if (item.auction) {
                        if (auction.auction) {
                            delete auction.auction;
                        }
                        if (auction.denom_id) {
                            delete auction.denom_id;
                        }

                        auction = {
                            ...auction,
                            auction: item.auction,
                            denom_id: item.denom_id,
                            nft_id: auction,
                        };
                    }

                    return (
                        item.auction
                            ? <Card
                                key={index}
                                index={index}
                                item={auction}/>
                            : <div
                                key={index}
                                className={ClassNames('list_page', (props.activeValue) === (item && item.id) ? 'active' : '')}
                                onClick={(e) => handleShow({
                                    nftDetails: item,
                                    collectionDetails: item.denom_id,
                                    list: item.list ? item.list : 'not Listed',
                                }, e)}
                                onMouseOut={handleMouseOut}
                                onMouseOver={handleMouseOver}>
                                <div className="list_section1">
                                    <div className="list_section1_left">
                                        {mediaType &&
                                            <div className="asset_type">
                                                {mediaType && getAssetType(mediaType)}
                                            </div>}
                                        {/* <div><img alt="icon" src={lockIcon}/></div> */}
                                        {/* <div><img alt="icon" src={settingIcon}/></div> */}
                                        {item && item.transferable &&
                                            <Tooltip title={variables[props.lang].transferability}>
                                                <div><img alt="icon" src={arrowIcon}/></div>
                                            </Tooltip>}
                                    </div>
                                    <div className="list_section1_right">
                                        {/* <span>Artwork</span> */}
                                        {item && item.owner && (item.owner === props.address) &&
                                            !item.list && !item.auction &&
                                            <div onClick={(event) => handleMoreOptions(event, item)}>
                                                <img alt="icon" src={moreIcon}/>
                                            </div>}
                                    </div>
                                </div>
                                {mediaType &&
                                getAssetType(mediaType) === 'video'
                                    ? <div
                                        className={ClassNames('list_section2 inline_video_section', item && item.nsfw ? 'blur' : '')}>
                                        <VideoOnLoad
                                            preview={item && item.preview_uri}
                                            src={item && item.media_uri}
                                            type={mediaType}/>
                                    </div>
                                    : mediaType &&
                                    getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                        ? <ImageOnLoad
                                            className={ClassNames('list_section2', item && item.nsfw ? 'blur' : '')}
                                            preview={item && item.preview_uri}
                                            src={item && item.media_uri}/>
                                        : mediaType &&
                                        getAssetType(mediaType) === 'image'
                                            ? <ImageOnLoad
                                                cdn={item && item.cloudflare_cdn && item.cloudflare_cdn.variants}
                                                className={ClassNames('list_section2', item && item.nsfw ? 'blur' : '')}
                                                preview={item && item.preview_uri}
                                                src={item && item.media_uri}/>
                                            : <ImageOnLoad
                                                className={ClassNames('list_section2', item && item.nsfw ? 'blur' : '')}
                                                src={item && item.preview_uri}/>}
                                <div className="list_section3">
                                    <div className="list_section3_div">
                                        <Tooltip
                                            title={(item.denom_id && item.denom_id.name) + ' | ' + (item.denom_id && item.denom_id.symbol)}>
                                            <a
                                                href={'/collection/' + (item.denom_id && item.denom_id.id)}
                                                rel="no-refresh"
                                                onClick={handleReDirect}>
                                                {item.denom_id && item.denom_id.name}
                                            </a>
                                        </Tooltip>
                                        {item.denom_id && item.denom_id.IP_infringement
                                            ? <Tooltip title={variables[props.lang]['ip_tooltip']}>
                                                <CopyRight/>
                                            </Tooltip>
                                            : item.denom_id && item.denom_id.verified
                                                ? <Tooltip title={variables[props.lang]['genesis_creator']}>
                                                    <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                                </Tooltip>
                                                : null}
                                    </div>
                                    <Tooltip title={item && item.name}>
                                        <a
                                            className="list_section3_span"
                                            href={'/nft/' + (item && item.id)}
                                            rel="no-refresh"
                                            onClick={handleReDirect}>
                                            {item && item.name}
                                        </a>
                                    </Tooltip>
                                </div>
                                <div className="list_border"/>
                                <div className="list_section4">
                                    <div className="list_section4_left">
                                        <span>{variables[props.lang].owner}</span>
                                        <div
                                            className="lsl_value hash_text">
                                            <p className="name">{item.owner}</p>
                                            {item.owner.slice(item.owner.length - 4, item.owner.length)}
                                        </div>
                                    </div>
                                    <div className="list_section4_right">
                                        <span>{variables[props.lang].price}</span>
                                        {item.list && item.list.price
                                            ? ibcToken && ibcToken.network && ibcToken.network.decimals
                                                ? <span className="lsr_value">
                                                    {((item.list.price && item.list.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals))) > 100
                                                        ? formatCount((item.list.price && item.list.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals)), true)
                                                        : (item.list.price && item.list.price.amount) / (10 ** (ibcToken.network && ibcToken.network.decimals))}
                                                    {' ' + ((ibcToken && ibcToken.network && ibcToken.network.display_denom) || item.list.price.denom)}
                                                </span>
                                                : <span className="lsr_value">
                                                    {((item.list.price && item.list.price.amount) / (10 ** config.COIN_DECIMALS)) > 100
                                                        ? formatCount((item.list.price && item.list.price.amount) / (10 ** config.COIN_DECIMALS), true)
                                                        : (item.list.price && item.list.price.amount) / (10 ** config.COIN_DECIMALS)}
                                                    {' ' + ((tokenType && tokenType.label) || (item.list.price.denom))}</span>
                                            : <span>{variables[props.lang]['not_listed']}</span>}
                                    </div>
                                </div>
                            </div>
                    );
                }) : <NoData/>}
        </>
    );
};

NFTsList.propTypes = {
    address: PropTypes.string.isRequired,
    filterShow: PropTypes.bool.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    nftSList: PropTypes.array.isRequired,
    nftSTotal: PropTypes.number.isRequired,
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    showMenuPopover: PropTypes.func.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        filterShow: state.filters.show,
        showActive: state.explore.activeCard.open,
        activeValue: state.explore.activeCard.activeNFTID,
        address: state.account.wallet.connection.address,
        nftSList: state.myAccount.userNFTs.result,
        nftSTotal: state.myAccount.userNFTs.count,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

const actionToProps = {
    hideFilters,
    hideActiveCard,
    show: showActiveCard,
    showMenuPopover,
};

export default withRouter(connect(stateToProps, actionToProps)(NFTsList));
