import React, { Component } from 'react';
// import moreIcon from '../../../assets/explore/more.svg';
import arrowIcon from '../../assets/explore/transferability.svg';
import * as PropTypes from 'prop-types';
import variables from '../../utils/variables';
import { hideActiveCard, showActiveCard } from '../../actions/explore';
import { hideFilters } from '../../actions/filters';
import ClassNames from 'classnames';
import NoData from '../../components/NoData';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import ImageOnLoad from '../../components/ImageOnLoad/BackgroundImage';
import { tokensList } from '../../utils/defaultOptions';
import { config } from '../../config';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import { formatCount } from '../../utils/price';
import genesisCreatorIcon from '../../assets/diamond.svg';
import { Tooltip } from '@mui/material';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';
import moreIcon from '../../assets/explore/more.svg';
import { showMenuPopover } from '../../actions/marketplace';

class NFTsList extends Component {
    constructor (props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleReDirect = this.handleReDirect.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMoreOptions = this.handleMoreOptions.bind(this);
    }

    componentDidMount () {
        document.body.style.overflow = null;
    }

    handleShow (value, event) {
        let card = event.target;
        if (!event.target.classList.contains('list_page')) {
            card = event.target.closest('.list_page');
        }
        if (!this.props.showActive) {
            card && card.scrollIntoView();
        } else {
            window.scrollTo({
                top: (card && card.offsetTop) + 190,
                behavior: 'smooth',
            });
        }

        if (this.props.filterShow) {
            this.props.hideFilters();
        }

        this.props.show(value);
    }

    handleReDirect (event) {
        event.stopPropagation();
        if (this.props.showActive) {
            this.props.hideActiveCard();
        }
    }

    handleMouseOver (event) {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.play();
        }
    }

    handleMouseOut (event) {
        const element = event.currentTarget.querySelector('video');

        if (element) {
            element.pause();
        }
    }

    handleMoreOptions (event, item) {
        event.stopPropagation();
        this.props.showMenuPopover(event, item);
    }

    render () {
        return (
            <>
                {this.props.nftSList && this.props.nftSList.length
                    ? this.props.nftSList.map((item, index) => {
                        const tokenType = item && item.price && item.price.denom &&
                            tokensList.find((val) => val.value === item.price.denom);
                        const ibcToken = item && item.price && item.price.denom &&
                            this.props.ibcTokensList && this.props.ibcTokensList.length &&
                            this.props.ibcTokensList.find((val) =>
                                val && val.ibc_denom_hash && (val.ibc_denom_hash === item.price.denom));
                        const mediaType = item && item.media_type;

                        return (
                            <div
                                key={index}
                                className={ClassNames('list_page', (this.props.activeValue) === (item && item.id) ? 'active' : '')}
                                onClick={(e) => this.handleShow({
                                    nftDetails: item,
                                    collectionDetails: item.denom_id,
                                }, e)}
                                onMouseOut={this.handleMouseOut}
                                onMouseOver={this.handleMouseOver}>
                                <div className="list_section1">
                                    <div className="list_section1_left">
                                        {mediaType &&
                                            <div className="asset_type">
                                                {mediaType && getAssetType(mediaType)}
                                            </div>}
                                        {/* <div><img alt="icon" src={lockIcon}/></div> */}
                                        {/* <div><img alt="icon" src={settingIcon}/></div> */}
                                        {item && item.transferable &&
                                            <Tooltip title={variables[this.props.lang].transferability}>
                                                <div><img alt="icon" src={arrowIcon}/></div>
                                            </Tooltip>}
                                    </div>
                                    <div className="list_section1_right">
                                        {/* <span>Artwork</span> */}
                                        {item && item.owner && (item.owner === this.props.address) &&
                                            !item.list && !item.auction &&
                                            <div onClick={(event) => this.handleMoreOptions(event, item)}>
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
                                                onClick={this.handleReDirect}>
                                                {item.denom_id && item.denom_id.name}
                                            </a>
                                        </Tooltip>
                                        {item.denom_id && item.denom_id.IP_infringement
                                            ? <Tooltip title={variables[this.props.lang]['ip_tooltip']}>
                                                <CopyRight/>
                                            </Tooltip>
                                            : item.denom_id && item.denom_id.verified
                                                ? <Tooltip title={variables[this.props.lang]['genesis_creator']}>
                                                    <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                                </Tooltip>
                                                : null}
                                    </div>
                                    <Tooltip title={item && item.name}>
                                        <a
                                            className="list_section3_span"
                                            href={'/nft/' + (item && item.id)}
                                            rel="no-refresh"
                                            onClick={this.handleReDirect}>
                                            {item && item.name}
                                        </a>
                                    </Tooltip>
                                </div>
                                <div className="list_border"/>
                                <div className="list_section4">
                                    <div className="list_section4_left">
                                        <span>{variables[this.props.lang].owner}</span>
                                        <a
                                            className="lsl_value hash_text"
                                            href={`/account/${item.owner}/nfts`}
                                            rel="no-refresh"
                                            title={item.owner}
                                            onClick={this.handleReDirect}>
                                            <p className="name">{item.owner}</p>
                                            {item.owner && item.owner.slice(item.owner.length - 4, item.owner.length)}
                                        </a>
                                    </div>
                                    <div className="list_section4_right">
                                        <span>{variables[this.props.lang].price}</span>
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
                                            : <span>{variables[this.props.lang]['not_listed']}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <NoData/>}
            </>
        );
    }
}

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
    show: PropTypes.func.isRequired,
    showActive: PropTypes.bool.isRequired,
    showMenuPopover: PropTypes.func.isRequired,
    activeValue: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        filterShow: state.collection.filters.showCollectionFilter,
        showActive: state.explore.activeCard.open,
        activeValue: state.explore.activeCard.activeNFTID,
        address: state.account.wallet.connection.address,
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
