import React, { Component } from 'react';
import './index.css';
import '../MarketPlace/index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import ClassNames from 'classnames';
import { Button, Tab, Tabs, Tooltip } from '@mui/material';
import genesisCreatorIcon from '../../assets/diamond.svg';
import { fetchCollection, showSchemaJsonDialog } from '../../actions/marketplace';
import { tokensList } from '../../utils/defaultOptions';
import { commaSeparator, splitDecimals } from '../../utils/numbers';
import { config, DEFAULT_LAZY_FETCH_HEIGHT, DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import { fetchCollectionActivity } from '../../actions/activity';
import NetworkImages from '../../components/NetworkImages';
import {
    fetchCollectionAuctions,
    fetchCollectionMyNFTs,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
} from '../../actions/collections';
import { hideActiveCard } from '../../actions/explore';
import { ReactComponent as CopyRight } from '../../assets/copy-right.svg';
import { getAssetType, getAssetTypeExtension } from '../../utils/strings';
import VideoOnLoad from '../../components/ImageOnLoad/VideoOnLoad';
import ImageOnLoad from '../../components/ImageOnLoad';
import thumbnail from '../../assets/collections/thumbnail.svg';
import { Helmet } from 'react-helmet';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../../constants/seo';
import PlaceBidDialog from '../MarketPlace/ActiveCard/PlaceBid/PlaceBidDialog';
import Auctions from './Auctions';
import { hideCollectionFilters, setCollectionOnSaleIn } from '../../actions/collections/filters';
import BurnDialog from '../MarketPlace/BurnDialog';
import MenuPopover from '../MarketPlace/MenuPopover';
import DeListDialog from '../MarketPlace/ActiveCard/DeList/DeListDialog';
import TransferDialog from '../MarketPlace/ActiveCard/TransferSell/TransferDialog';
import ListDialog from '../MarketPlace/ActiveCard/TransferSell/ListDialog';
import BuyNFTDialogResponse from '../MarketPlace/ActiveCard/PurchaseCard/BuyNFTDialogResponse';
import JsonSchemaDialog from './JsonSchemaDialog';
import CollectionInfoSkeletonLoader from '../../components/SkeletonLoader/CollectionInfo';
import Explore from './ListingPage';
import Activity from './Activity';

class SingleCollection extends Component {
    constructor (props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            show: false,
            value: 'listed',
            fix: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleReDirect = this.handleReDirect.bind(this);
    }

    componentDidMount () {
        const route = this.props.match && this.props.match.params && this.props.match.params.id;
        if (route) {
            this.props.fetchCollection(route);
            this.props.fetchListedCollectionNFTs(route, DEFAULT_SKIP, DEFAULT_LIMIT);
        }

        this.props.hideFilters();
        this.props.setOnSaleIn(new Set());
        if (this.props.activeCardShow) {
            this.props.hide();
        }

        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate (pp, ps, ss) {
        if ((pp.address !== this.props.address) && this.props.address === '') {
            this.setState({
                value: 'listed',
            });
        }
    }

    handleScroll () {
        const header = this.myRef.current;
        const scroll = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight;
        const height = window.innerHeight;
        const route = this.props.match && this.props.match.params && this.props.match.params.id;

        if (this.state.value === 'listed') {
            if (((this.props.listedNFTs && this.props.listedNFTs.length) < this.props.listedNFTsTotal) &&
                ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
                !(this.props.listedNFTsInProgress)) {
                if (this.props.denomValue && this.props.denomValue.size) {
                    this.props.fetchListedCollectionNFTs(route, this.props.listedNFTsSkip + DEFAULT_LIMIT, this.props.listedNFTsLimit,
                        [...this.props.denomValue], null, null, this.props.sortBy, this.props.order, this.props.listedSearch);
                } else if (this.props.priceRangeValue && this.props.priceRangeValue.network &&
                    this.props.priceRange && this.props.priceRange.length &&
                    ((this.props.priceRange[0] > 0) || (this.props.priceRange[1] < 50000))) {
                    const decimals = this.props.priceRangeValue && this.props.priceRangeValue.network &&
                        (this.props.priceRangeValue.network.COIN_DECIMALS || this.props.priceRangeValue.network.decimals);
                    const minValue = this.props.priceRange[0] * (10 ** decimals);
                    const maxValue = this.props.priceRange[1] * (10 ** decimals);

                    this.props.fetchListedCollectionNFTs(route, this.props.listedNFTsSkip + DEFAULT_LIMIT, this.props.listedNFTsLimit,
                        [this.props.priceRangeValue.ibc_denom_hash || this.props.priceRangeValue.value], minValue, maxValue, this.props.sortBy, this.props.order, this.props.listedSearch);
                } else {
                    this.props.fetchListedCollectionNFTs(route, this.props.listedNFTsSkip + DEFAULT_LIMIT, this.props.listedNFTsLimit, null, null, null, this.props.sortBy, this.props.order, this.props.listedSearch);
                }
            }
        }

        if (this.state.value === 'not_listed') {
            if (((this.props.nonListedNFTs && this.props.nonListedNFTs.length) < this.props.nonListedNFTsTotal) &&
                ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
                !(this.props.nonListedNFTsInProgress) && (route)) {
                this.props.fetchNonListedCollectionNFTs(route, this.props.nonListedNFTsSkip + DEFAULT_LIMIT, this.props.nonListedNFTsLimit, this.props.nonListedSearch);
            }
        }

        if (this.state.value === 'activity') {
            if (((this.props.activities && this.props.activities.length) < this.props.activitiesTotal) &&
                ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
                (route) && !(this.props.activitiesInProgress)) {
                this.props.fetchCollectionActivity(route, this.props.activitiesSkip + DEFAULT_LIMIT, this.props.activitiesLimit);
            }
        }

        if (this.state.value === 'my_nfts') {
            if (((this.props.myNFTs && this.props.myNFTs.length) < this.props.myNFTsTotal) &&
                ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
                !(this.props.myNFTsInProgress) && (route)) {
                this.props.fetchCollectionMyNFTs(route, this.props.address, this.props.myNFTsSkip + DEFAULT_LIMIT, this.props.myNFTsLimit);
            }
        }

        if (this.state.value === 'auctions') {
            if (((this.props.auctions && this.props.auctions.length) < this.props.auctionsTotal) &&
                ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
                !(this.props.auctionsInProgress)) {
                if (this.props.denomValueCA && this.props.denomValueCA.size) {
                    this.props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, [...this.props.denomValueCA], null, null,
                        this.props.auctionsTypeCA, this.props.address, this.props.sortBy, this.props.order, this.props.listedSearch);
                } else if (this.props.priceRangeValueCA && this.props.priceRangeValueCA.network &&
                    this.props.priceRangeCA && this.props.priceRangeCA.length &&
                    ((this.props.priceRangeCA[0] > 0) || (this.props.priceRangeCA[1] < 50000))) {
                    const decimals = this.props.priceRangeValueCA && this.props.priceRangeValueCA.network &&
                        (this.props.priceRangeValueCA.network.COIN_DECIMALS || this.props.priceRangeValueCA.network.decimals);
                    const minValue = this.props.priceRangeCA[0] * (10 ** decimals);
                    const maxValue = this.props.priceRangeCA[1] * (10 ** decimals);

                    this.props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT,
                        [this.props.priceRangeValueCA.ibc_denom_hash || this.props.priceRangeValueCA.value],
                        minValue, maxValue, this.props.auctionsTypeCA, this.props.address, this.props.sortBy, this.props.order, this.props.listedSearch);
                } else {
                    this.props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null, this.props.auctionsTypeCA, this.props.address,
                        this.props.sortBy, this.props.order, this.props.listedSearch);
                }
            }
        }

        if (header && header.getBoundingClientRect() && header.getBoundingClientRect().top &&
            ((header.getBoundingClientRect().top - 80) < 1) && this.state.fix) {
            return;
        }

        if (header && header.getBoundingClientRect() && header.getBoundingClientRect().top &&
            (header.getBoundingClientRect().top < 81) && !this.state.fix) {
            this.setState({
                fix: true,
            });
        } else if (this.state.fix) {
            this.setState({
                fix: false,
            });
        }
    }

    handleChange (event, newValue) {
        const route = this.props.match && this.props.match.params && this.props.match.params.id;
        if (route) {
            if (newValue === 'activity' && this.props.activities && !this.props.activities.length &&
                !this.props.activitiesInProgress) {
                this.props.fetchCollectionActivity(route, DEFAULT_SKIP, DEFAULT_LIMIT, 'created_at', 'desc');
            }
            if (newValue === 'not_listed' && this.props.nonListedNFTs && !this.props.nonListedNFTs.length &&
                !this.props.nonListedNFTsInProgress) {
                this.props.fetchNonListedCollectionNFTs(route, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (newValue === 'my_nfts' && this.props.myNFTs && !this.props.myNFTs.length &&
                !this.props.myNFTsInProgress) {
                this.props.fetchCollectionMyNFTs(route, this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (newValue === 'auctions' && this.props.auctions && !this.props.auctions.length &&
                !this.props.auctionsInProgress) {
                this.props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
        }

        if (newValue === 'not_listed') {
            this.props.hideFilters();
        }
        if (this.props.activeCardShow) {
            this.props.hide();
        }
        if (newValue === this.state.value) {
            return;
        }
        this.setState({
            value: newValue,
        });
    }

    handleSchemaJson () {
        const schema = this.props.collectionList &&
            this.props.collectionList.schema && JSON.parse(this.props.collectionList.schema);
        this.props.showSchemaJsonDialog(schema);
    }

    handleAccountPage (event, address) {
        event.stopPropagation();
        this.props.history.push(`/account/${address}`);
    }

    handleReDirect (event) {
        event.stopPropagation();
        if (this.props.activeCardShow) {
            this.props.hide();
        }
    }

    render () {
        const a11yProps = (index) => {
            return {
                id: `account-tab-${index}`,
                'aria-controls': `account-tab-panel-${index}`,
            };
        };
        const mediaType = this.props.collectionList && this.props.collectionList.media_type;

        return (
            <div
                className={ClassNames('collection_page', this.state.fix ? 'fix' : '', this.state.value === 'listed' ? 'listed_tab' : '')}>
                {this.props.collectionInProgress
                    ? <CollectionInfoSkeletonLoader/>
                    : <div className="collections">
                        <Helmet>
                            <meta charSet="utf-8"/>
                            <title>{this.props.collectionList && this.props.collectionList.name
                                ? this.props.collectionList.name + ' | OmniFlix'
                                : this.props.collectionList && this.props.collectionList.symbol
                                    ? this.props.collectionList.symbol + ' | OmniFlix'
                                    : DEFAULT_TITLE}</title>
                            <meta
                                content={this.props.collectionList && this.props.collectionList.description
                                    ? this.props.collectionList.description
                                    : DEFAULT_DESCRIPTION}
                                name="description"/>
                        </Helmet>
                        <div className="collection_profile">
                            <div className="image_section">
                                {mediaType &&
                                getAssetType(mediaType) === 'video'
                                    ? <div className="inline_video_section">
                                        <VideoOnLoad
                                            src={this.props.collectionList && this.props.collectionList.preview_uri}
                                            type={mediaType}/>
                                    </div>
                                    : mediaType &&
                                    getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                                        ? <ImageOnLoad
                                            className=""
                                            src={this.props.collectionList && this.props.collectionList.preview_uri ? this.props.collectionList.preview_uri : thumbnail}/>
                                        : <ImageOnLoad
                                            cdn={this.props.collectionList && this.props.collectionList.cloudflare_cdn && this.props.collectionList.cloudflare_cdn.variants}
                                            className=""
                                            src={this.props.collectionList && this.props.collectionList.preview_uri ? this.props.collectionList.preview_uri : thumbnail}/>}
                            </div>
                            <div className="text_section">
                                <div className="text_section1">
                                    <span>
                                        {this.props.collectionList && this.props.collectionList.name}
                                    </span>
                                    {this.props.collectionList && this.props.collectionList.IP_infringement
                                        ? <Tooltip title={variables[this.props.lang]['cr_collection_card']}>
                                            <div className="copy_right">
                                                <div className="copy_right_icon">
                                                    <CopyRight/>
                                                </div>
                                            </div>
                                        </Tooltip>
                                        : this.props.collectionList && this.props.collectionList.verified
                                            ? <Tooltip title={variables[this.props.lang]['genesis_creator']}>
                                                <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                            </Tooltip> : null}
                                </div>
                                <div className="text_section2">
                                    <div> Created by&nbsp;
                                        {this.props.collectionList && this.props.collectionList.creator &&
                                            <a
                                                className="hash_text"
                                                href={'/account/' + this.props.collectionList.creator}
                                                rel="no-refresh"
                                                title={this.props.collectionList.creator}
                                                onClick={this.handleReDirect}>
                                                <p className="name">{this.props.collectionList.creator}</p>
                                                {this.props.collectionList.creator.slice(this.props.collectionList.creator.length - 4,
                                                    this.props.collectionList.creator.length)}
                                            </a>}
                                    </div>
                                    {/* <img alt="" src={successIcon}/> */}
                                </div>
                            </div>
                            <div className="header_actions">
                                {this.props.collectionList &&
                                    this.props.collectionList.schema &&
                                    <div className="schema_json_button">
                                        <Button onClick={() => this.handleSchemaJson()}>
                                            <p>{variables[this.props.lang]['view_schema_json']}</p>
                                        </Button>
                                    </div>}
                            </div>
                        </div>
                        <div className="collection_section1">
                            <div>
                                <span>
                                    {this.props.collectionList && this.props.collectionList.total_nfts &&
                                        (this.props.collectionList.total_nfts)}
                                </span>
                                <span> Items</span>
                            </div>
                            <span/>
                            <div>
                                <span>
                                    {this.props.collectionList && this.props.collectionList.unique_owners &&
                                        (this.props.collectionList.unique_owners)}
                                </span>
                                <span> Owners</span>
                            </div>
                        </div>
                        <div className="collection_section2">
                            {this.props.collectionList && this.props.collectionList.description}
                        </div>
                        <div className="traded_floor_price">
                            {this.props.collectionList && this.props.collectionList.trade_info &&
                            Object.keys(this.props.collectionList.trade_info) &&
                            Object.keys(this.props.collectionList.trade_info).length > 0
                                ? <div className="total_tokens_traded">
                                    <h2>{variables[this.props.lang]['total_traded_value']}</h2>
                                    <div className="tokens_list">
                                        {this.props.collectionList.trade_info &&
                                            Object.keys(this.props.collectionList.trade_info).map((item, index) => {
                                                const tokenType = item &&
                                                    tokensList.find((val) => val.value === item);

                                                const ibcToken = item && this.props.ibcTokensList && this.props.ibcTokensList.length &&
                                                    this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash &&
                                                        (val.ibc_denom_hash === item));
                                                const name = (ibcToken && ibcToken.network && ibcToken.network.display_denom) ||
                                                    (tokenType && tokenType.label);

                                                const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
                                                    ? ibcToken.network.decimals
                                                    : config.COIN_DECIMALS;
                                                const balance = Object.values(this.props.collectionList.trade_info)[index] &&
                                                    splitDecimals(Object.values(this.props.collectionList.trade_info)[index] / (10 ** decimals));

                                                return (
                                                    <>
                                                        <div key={index}>
                                                            <NetworkImages name={name}/>
                                                            <div className="token_info">
                                                                <p>{name}</p>
                                                                <span className="token_bal">
                                                                    {balance && balance.length
                                                                        ? <>
                                                                            {balance.length && balance[0] && commaSeparator(balance[0])}
                                                                            {balance.length && balance[1] &&
                                                                                <span>.{balance.length && balance[1]}</span>}
                                                                        </>
                                                                        : 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                    </div>
                                </div>
                                : null}
                            {this.props.collectionList && this.props.collectionList.floor_prices &&
                            Object.keys(this.props.collectionList.floor_prices).length
                                ? <>
                                    <div className="total_tokens_traded">
                                        <h2>{variables[this.props.lang]['floor_price']}</h2>
                                        <div className="tokens_list">
                                            {this.props.collectionList && this.props.collectionList.floor_prices &&
                                                Object.keys(this.props.collectionList.floor_prices).map((item, index) => {
                                                    const tokenType = item &&
                                                        tokensList.find((val) => val.value === item);

                                                    const ibcToken = item && this.props.ibcTokensList && this.props.ibcTokensList.length &&
                                                        this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash &&
                                                            (val.ibc_denom_hash === item));
                                                    const name = (ibcToken && ibcToken.network && ibcToken.network.display_denom) ||
                                                        (tokenType && tokenType.label);

                                                    const decimals = ibcToken && ibcToken.network && ibcToken.network.decimals
                                                        ? ibcToken.network.decimals
                                                        : config.COIN_DECIMALS;
                                                    const balance = Object.values(this.props.collectionList.floor_prices)[index] &&
                                                        splitDecimals(Object.values(this.props.collectionList.floor_prices)[index] / (10 ** decimals));

                                                    return (
                                                        <>
                                                            <div key={index}>
                                                                <NetworkImages name={name}/>
                                                                <div className="token_info">
                                                                    <p>{name}</p>
                                                                    <span className="token_bal">
                                                                        {balance && balance.length
                                                                            ? <>
                                                                                {balance.length && balance[0] && commaSeparator(balance[0])}
                                                                                {balance.length && balance[1] &&
                                                                                    <span>.{balance.length && balance[1]}</span>}
                                                                            </>
                                                                            : 0}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </>
                                : null}
                        </div>
                        {this.props.collectionList && this.props.collectionList.IP_infringement &&
                            <div className="copy_right">
                                <div>
                                    <CopyRight/>
                                    <span>
                                        {variables[this.props.lang]['copy_right']}
                                    </span>
                                </div>
                            </div>}
                        <JsonSchemaDialog/>
                    </div>}
                <Tabs
                    ref={this.myRef}
                    centered
                    className={ClassNames('horizontal_tabs', this.state.fix ? 'sticky' : '')}
                    id="sticky-tabs"
                    value={this.state.value}
                    onChange={this.handleChange}>
                    {this.state.fix &&
                        <div className="collection_profile sticky_profile">
                            <div className="image_section">
                                {this.props.collectionList && this.props.collectionList.preview_uri
                                    ? <img alt="" src={this.props.collectionList.preview_uri}/>
                                    : ''}
                            </div>
                            <div className="text_section">
                                <div className="text_section1">
                                    <span>
                                        {this.props.collectionList && this.props.collectionList.name}
                                    </span>
                                </div>
                                <div className="text_section2">
                                    <div>
                                        <span className="created_by">Created by</span>
                                        {this.props.collectionList && this.props.collectionList.creator &&
                                            <div
                                                className="hash_text"
                                                title={this.props.collectionList.creator}
                                                onClick={(e) => this.handleAccountPage(e, this.props.collectionList.creator)}>
                                                <p className="name">{this.props.collectionList.creator}</p>
                                                {this.props.collectionList.creator.slice(this.props.collectionList.creator.length - 4,
                                                    this.props.collectionList.creator.length)}
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>}
                    <Tab
                        className={'tab ' + (this.state.value === 'listed' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].listed}</p>}
                        value="listed"
                        {...a11yProps(0)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'not_listed' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang]['not_listed']}</p>}
                        value="not_listed"
                        {...a11yProps(1)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'auctions' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].auctions}</p>}
                        value="auctions"
                        {...a11yProps(2)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'activity' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].activity}</p>}
                        value="activity"
                        {...a11yProps(3)} />
                    {this.props.address &&
                        <Tab
                            className={'tab ' + (this.state.value === 'my_nfts' ? 'active_tab' : '')}
                            label={<p className="text">{variables[this.props.lang]['my_nfts']}</p>}
                            value="my_nfts"
                            {...a11yProps(4)} />}
                </Tabs>
                {this.state.value === 'listed' &&
                    <Explore child listed activeTab={this.state.value}/>}
                {this.state.value === 'not_listed' &&
                    <Explore child notListed/>}
                {this.state.value === 'auctions' &&
                    <Auctions child activeTab={this.state.value}/>}
                {this.state.value === 'activity' && <div className="activity_table">
                    <div className="activities_list">
                        <Activity/>
                    </div>
                </div>}
                {this.state.value === 'my_nfts' &&
                    <Explore child myNfts/>}
                <DeListDialog/>
                <TransferDialog/>
                <ListDialog/>
                <BuyNFTDialogResponse/>
                <PlaceBidDialog/>
                <BurnDialog/>
                <MenuPopover/>
            </div>
        );
    }
}

SingleCollection.propTypes = {
    activeCardShow: PropTypes.bool.isRequired,
    activities: PropTypes.array.isRequired,
    activitiesInProgress: PropTypes.bool.isRequired,
    activitiesLimit: PropTypes.number.isRequired,
    activitiesSkip: PropTypes.number.isRequired,
    activitiesTotal: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    auctions: PropTypes.array.isRequired,
    auctionsInProgress: PropTypes.bool.isRequired,
    auctionsTypeCA: PropTypes.string.isRequired,
    collectionInProgress: PropTypes.bool.isRequired,
    collectionList: PropTypes.object.isRequired,
    denomValue: PropTypes.object.isRequired,
    denomValueCA: PropTypes.object.isRequired,
    fetchCollection: PropTypes.func.isRequired,
    fetchCollectionActivity: PropTypes.func.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    fetchCollectionMyNFTs: PropTypes.func.isRequired,
    fetchListedCollectionNFTs: PropTypes.func.isRequired,
    fetchNonListedCollectionNFTs: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    listedNFTs: PropTypes.array.isRequired,
    listedNFTsInProgress: PropTypes.bool.isRequired,
    listedNFTsLimit: PropTypes.number.isRequired,
    listedNFTsSkip: PropTypes.number.isRequired,
    listedNFTsTotal: PropTypes.number.isRequired,
    listedSearch: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    myNFTs: PropTypes.array.isRequired,
    myNFTsInProgress: PropTypes.bool.isRequired,
    myNFTsLimit: PropTypes.number.isRequired,
    myNFTsSkip: PropTypes.number.isRequired,
    myNFTsTotal: PropTypes.number.isRequired,

    nonListedNFTs: PropTypes.array.isRequired,
    nonListedNFTsInProgress: PropTypes.bool.isRequired,
    nonListedNFTsLimit: PropTypes.number.isRequired,
    nonListedNFTsSkip: PropTypes.number.isRequired,
    nonListedNFTsTotal: PropTypes.number.isRequired,
    nonListedSearch: PropTypes.string.isRequired,

    priceRange: PropTypes.array.isRequired,
    priceRangeCA: PropTypes.array.isRequired,
    priceRangeValue: PropTypes.object.isRequired,
    priceRangeValueCA: PropTypes.object.isRequired,

    setOnSaleIn: PropTypes.func.isRequired,
    showSchemaJsonDialog: PropTypes.func.isRequired,
    auctionsLimit: PropTypes.number,
    auctionsSearch: PropTypes.string,
    auctionsSkip: PropTypes.number,
    auctionsTotal: PropTypes.number,
    order: PropTypes.string,
    sortBy: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        activeCardShow: state.explore.activeCard.open,
        inProgress: state.account.wallet.connection.inProgress,
        lang: state.language,
        collectionList: state.marketplace.collection.result,
        collectionInProgress: state.marketplace.collection.inProgress,

        activities: state.activity.collectionActivity.result,
        activitiesInProgress: state.activity.collectionActivity.inProgress,
        activitiesSkip: state.activity.collectionActivity.skip,
        activitiesLimit: state.activity.collectionActivity.limit,
        activitiesTotal: state.activity.collectionActivity.total,

        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,

        sortBy: state.collection.collectionNFTsSort.sortBy,
        order: state.collection.collectionNFTsSort.order,

        listedNFTs: state.collection.listedCollectionNFTs.result,
        listedNFTsInProgress: state.collection.listedCollectionNFTs.inProgress,
        listedNFTsTotal: state.collection.listedCollectionNFTs.total,
        listedNFTsSkip: state.collection.listedCollectionNFTs.skip,
        listedNFTsLimit: state.collection.listedCollectionNFTs.limit,

        nonListedNFTs: state.collection.nonListedCollectionNFTs.result,
        nonListedNFTsInProgress: state.collection.nonListedCollectionNFTs.inProgress,
        nonListedNFTsTotal: state.collection.nonListedCollectionNFTs.total,
        nonListedNFTsSkip: state.collection.nonListedCollectionNFTs.skip,
        nonListedNFTsLimit: state.collection.nonListedCollectionNFTs.limit,

        priceRangeValue: state.collection.filters.priceRangeCollection.value,
        priceRange: state.collection.filters.priceRangeCollection.range,
        denomValue: state.collection.filters.onSaleInCollection.value,
        max: state.collection.filters.priceRangeCollection.max,
        min: state.collection.filters.priceRangeCollection.min,
        listedSearch: state.collection.listedSearch.value,
        nonListedSearch: state.collection.nonListedSearch.value,
        auctionsSearch: state.collection.collectionAuctionSearch.value,

        myNFTs: state.collection.collectionMyNFTs.result,
        myNFTsInProgress: state.collection.collectionMyNFTs.inProgress,
        myNFTsTotal: state.collection.collectionMyNFTs.total,
        myNFTsSkip: state.collection.collectionMyNFTs.skip,
        myNFTsLimit: state.collection.collectionMyNFTs.limit,

        auctions: state.collection.auctions.result,
        auctionsInProgress: state.collection.auctions.inProgress,
        auctionsTotal: state.collection.auctions.total,
        auctionsSkip: state.collection.auctions.skip,
        auctionsLimit: state.collection.auctions.limit,

        denomValueCA: state.auctions.filters.onSaleInCA.value,
        priceRangeValueCA: state.auctions.filters.priceRangeCA.value,
        priceRangeCA: state.auctions.filters.priceRangeCA.range,
        auctionsTypeCA: state.auctions.filters.auctionsTypeCA,
    };
};

const actionToProps = {
    showSchemaJsonDialog,
    fetchCollection,
    fetchCollectionActivity,
    fetchCollectionAuctions,
    fetchListedCollectionNFTs,
    fetchNonListedCollectionNFTs,
    hideFilters: hideCollectionFilters,
    hide: hideActiveCard,
    setOnSaleIn: setCollectionOnSaleIn,
    fetchCollectionMyNFTs,
};

export default withRouter(connect(stateToProps, actionToProps)(SingleCollection));
