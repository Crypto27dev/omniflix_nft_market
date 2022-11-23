import React from 'react';
import './index.css';
import { IconButton } from '@mui/material';
import { ReactComponent as FilterButton } from '../../assets/explore/filter.svg';
import SortByPopover from '../MarketPlace/SortByPopover';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideFilters, setOnSaleIn, showFilters } from '../../actions/filters';
import ClassNames from 'classnames';
import { hideActiveCard } from '../../actions/explore';
import { fetchLaunchpadCollectionsList, fetchListings, setMarketPlaceTab } from '../../actions/marketplace';
import { DEFAULT_LAZY_FETCH_HEIGHT, DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import NoData from '../../components/NoData';
import SearchTextField from './SearchTextField';
import AuctionsSearch from './Auctions/SearchTextField';
import AuctionsSortByPopover from './Auctions/SortByPopover';
import PlaceBidDialog from './ActiveCard/PlaceBid/PlaceBidDialog';
import Tabs from './Tabs';
import { fetchAuctionsListings } from '../../actions/auctions';
import FiltersAuctions from '../MarketPlace/Auctions/Filters';
import { hideListingAuctionFilters, setLAOnSaleIn, showListingAuctionFilters } from '../../actions/auctions/filters';
import { fetchStats } from '../../actions/home';
import SkeletonLoader from '../../components/SkeletonLoader';
import Filters from './Filters';
import ActiveCard from './ActiveCard';
import DeListDialog from './ActiveCard/DeList/DeListDialog';
import ListDialog from './ActiveCard/TransferSell/ListDialog';
import TransferDialog from './ActiveCard/TransferSell/TransferDialog';
import BuyNFTDialogResponse from './ActiveCard/PurchaseCard/BuyNFTDialogResponse';
import LaunchpadList from './Launchpad';
import BuyNowList from './CollectNowList';
import AuctionsList from './Auctions/List';
import LaunchpadSearchTextField from './Launchpad/SearchTextField';

class MarketPlace extends React.Component {
    constructor (props) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.handleFilterLA = this.handleFilterLA.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    componentDidMount () {
        if (this.props.tabValue === 'collect_now' && this.props.listings &&
            !this.props.listings.length && !this.props.listingsInProgress) {
            this.props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT);
        }
        if (this.props.tabValue === 'auctions' && this.props.auctionListings &&
            !this.props.auctionListings.length && !this.props.auctionListingsInProgress) {
            this.props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT);
        }
        if (this.props.tabValue === 'launchpad' && this.props.launchpadCollections &&
            !this.props.launchpadCollections.length && !this.props.launchpadCollectionsInProgress &&
            (this.props.launchpadCollectionsSearch === '')) {
            if (this.props.address) {
                this.props.fetchLaunchpadCollections(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            } else {
                this.props.fetchLaunchpadCollections(null, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
        }
        if (!this.props.statsInProgress) {
            this.props.fetchStats();
        }

        if (!this.props.child) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
            const elements = document.getElementsByClassName('scroll_bar');

            for (let i = 0, len = elements.length; i < len; i++) {
                elements[i].style.overflow = 'unset';
            }
        }

        if (this.props.show) {
            this.props.hide();
        }
        if (this.props.filterShow) {
            this.props.hideFilters();
        }
        this.props.setOnSaleIn(new Set());

        if (this.props.filterShowLA) {
            this.props.hideListingAuctionFilters();
        }
        this.props.setLAOnSaleIn(new Set());
    }

    componentDidUpdate (pp, ps, ss) {
        if (this.props.tabValue === 'launchpad' && pp.keys && pp.keys.bech32Address && this.props.keys &&
            this.props.keys.bech32Address && (pp.keys.bech32Address !== this.props.keys.bech32Address)) {
            this.props.fetchLaunchpadCollections(this.props.keys.bech32Address, DEFAULT_SKIP, DEFAULT_LIMIT);
        }

        if (this.props.tabValue === 'launchpad' && (pp.address !== this.props.address) && this.props.address) {
            this.props.fetchLaunchpadCollections(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
        }
    }

    handleChangeTab (value) {
        if (value === this.props.tabValue) {
            return;
        }
        this.props.setMarketPlaceTab(value);

        if (value === 'collect_now' && this.props.listings &&
            !this.props.listings.length && !this.props.listingsInProgress) {
            this.props.fetchListings(DEFAULT_SKIP, DEFAULT_LIMIT);
        }
        if (value === 'auctions' && this.props.auctionListings &&
            !this.props.auctionListings.length && !this.props.auctionListingsInProgress) {
            this.props.fetchAuctionsListings(DEFAULT_SKIP, DEFAULT_LIMIT);
        }
        if (value === 'launchpad' && this.props.launchpadCollections &&
            !this.props.launchpadCollections.length && !this.props.launchpadCollectionsInProgress &&
            (this.props.launchpadCollectionsSearch === '')) {
            if (this.props.address) {
                this.props.fetchLaunchpadCollections(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            } else {
                this.props.fetchLaunchpadCollections(null, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
        }
    }

    handleOptions (value) {
        this.setState({
            [value]: !this.state[value],
        });
    }

    handleFilter () {
        if (this.props.show) {
            this.props.hide();
        }

        if (this.props.filterShow) {
            this.props.hideFilters();
        } else {
            this.props.showFilters();
        }
    }

    handleFilterLA () {
        if (this.props.filterShowLA) {
            this.props.hideListingAuctionFilters();
        } else {
            this.props.showListingAuctionFilters();
        }
    }

    handleScroll (e) {
        const scroll = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const height = e.target.clientHeight;

        // Buy Now Scroll Functionality
        if ((this.props.listings.length < this.props.listingsTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !(this.props.listingsInProgress) && (this.props.tabValue === 'collect_now')) {
            if (this.props.denomValue && this.props.denomValue.size) {
                this.props.fetchListings(this.props.listingsSkip + DEFAULT_LIMIT, this.props.listingsLimit,
                    [...this.props.denomValue], null, null, this.props.sortBy, this.props.order, this.props.listingSearch);
            } else if (this.props.priceRangeValue && this.props.priceRangeValue.network &&
                this.props.priceRange && this.props.priceRange.length &&
                ((this.props.priceRange[0] > 0) || (this.props.priceRange[1] < 50000))) {
                const decimals = this.props.priceRangeValue && this.props.priceRangeValue.network &&
                    (this.props.priceRangeValue.network.COIN_DECIMALS || this.props.priceRangeValue.network.decimals);
                const minValue = this.props.priceRange[0] * (10 ** decimals);
                const maxValue = this.props.priceRange[1] * (10 ** decimals);

                this.props.fetchListings(this.props.listingsSkip + DEFAULT_LIMIT, this.props.listingsLimit,
                    [this.props.priceRangeValue.ibc_denom_hash || this.props.priceRangeValue.value], minValue, maxValue, this.props.sortBy, this.props.order, this.props.listingSearch);
            } else {
                this.props.fetchListings(this.props.listingsSkip + DEFAULT_LIMIT, this.props.listingsLimit, null, null, null, this.props.sortBy, this.props.order, this.props.listingSearch);
            }
        }

        // Auctions Scroll Functionality
        if ((this.props.auctionListings.length < this.props.auctionListingsTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !(this.props.auctionListingsInProgress) && (this.props.tabValue === 'auctions')) {
            if (this.props.denomValueLA && this.props.denomValueLA.size) {
                this.props.fetchAuctionsListings(this.props.auctionListingsSkip + DEFAULT_LIMIT, this.props.auctionListingsSkip,
                    [...this.props.denomValueLA], null, null, this.props.auctionsTypeLA, this.props.address,
                    this.props.auctionListingsSortBy, this.props.auctionListingsOrder, this.props.listingSearch);
            } else if (this.props.priceRangeValueLA && this.props.priceRangeValueLA.network &&
                this.props.priceRangeLA && this.props.priceRangeLA.length &&
                ((this.props.priceRangeLA[0] > 0) || (this.props.priceRangeLA[1] < 50000))) {
                const decimals = this.props.priceRangeValueLA && this.props.priceRangeValueLA.network &&
                    (this.props.priceRangeValueLA.network.COIN_DECIMALS || this.props.priceRangeValueLA.network.decimals);
                const minValue = this.props.priceRangeLA[0] * (10 ** decimals);
                const maxValue = this.props.priceRangeLA[1] * (10 ** decimals);

                this.props.fetchAuctionsListings(this.props.auctionListingsSkip + DEFAULT_LIMIT, this.props.auctionListingsLimit,
                    [this.props.priceRangeValueLA.ibc_denom_hash || this.props.priceRangeValueLA.value], minValue, maxValue,
                    this.props.auctionsTypeLA, this.props.address, this.props.auctionListingsSortBy,
                    this.props.auctionListingsOrder, this.props.listingSearch);
            } else {
                this.props.fetchAuctionsListings(this.props.auctionListingsSkip + DEFAULT_LIMIT, this.props.auctionListingsLimit, null, null, null,
                    this.props.auctionsTypeLA, this.props.address, this.props.auctionListingsSortBy,
                    this.props.auctionListingsOrder, this.props.listingSearch);
            }
        }

        // Launchpad Scroll Functionality
        if ((this.props.launchpadCollections.length < this.props.launchpadCollectionsTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !(this.props.launchpadCollectionsInProgress) && (this.props.tabValue === 'launchpad')) {
            if (this.props.address) {
                this.props.fetchLaunchpadCollections(this.props.address, this.props.launchpadCollectionsSkip + DEFAULT_LIMIT, this.props.launchpadCollectionsLimit, this.props.launchpadCollectionsSearch);
            } else {
                this.props.fetchLaunchpadCollections(null, DEFAULT_SKIP, DEFAULT_LIMIT, this.props.launchpadCollectionsSearch);
            }
        }
    }

    render () {
        return (
            <div className={ClassNames('explore_main',
                this.props.filterShowLA && (this.props.tabValue === 'auctions')
                    ? 'show_filter'
                    : this.props.filterShow && (this.props.tabValue === 'collect_now') ? 'show_filter' : '',
                this.props.show ? 'show_active_card' : '')}>
                <div className="explore scroll_bar" id="market-place-scroll" onScroll={this.handleScroll}>
                    <div className="tabs_filter">
                        <div className="marketplace_tabs_section">
                            <Tabs statsData={this.props.statsData} onClick={this.handleChangeTab}/>
                        </div>
                        <div className="explore_header">
                            <div className="explore_head_left">
                                <div className="listing_search">
                                    {this.props.tabValue === 'launchpad'
                                        ? <LaunchpadSearchTextField/>
                                        : this.props.tabValue === 'auctions'
                                            ? <AuctionsSearch/>
                                            : <SearchTextField/>}
                                </div>
                            </div>
                            <div className="explore_head_right">
                                {this.props.tabValue === 'launchpad'
                                    ? null
                                    : this.props.tabValue === 'auctions'
                                        ? <AuctionsSortByPopover/>
                                        : <SortByPopover/>}
                                {/* <IconButton */}
                                {/*   className={this.state.grid ? 'active_button' : 'default_button'} */}
                                {/*   onClick={() => this.handleOptions('grid')}> */}
                                {/*   <GridButton/> */}
                                {/* </IconButton> */}
                                {this.props.tabValue === 'launchpad'
                                    ? null
                                    : this.props.tabValue === 'auctions'
                                        ? <IconButton
                                            className={this.props.filterShowLA ? 'active_button' : 'default_button'}
                                            onClick={this.handleFilterLA}>
                                            <span><FilterButton/></span>
                                        </IconButton>
                                        : <IconButton
                                            className={this.props.filterShow ? 'active_button' : 'default_button'}
                                            onClick={this.handleFilter}>
                                            <span><FilterButton/></span>
                                        </IconButton>}
                            </div>
                        </div>
                    </div>
                    {this.props.tabValue === 'collect_now' &&
                        <div className="lists">
                            {this.props.listings && (this.props.listings.length === 0) && this.props.listingsInProgress
                                ? <SkeletonLoader type="nft-card"/>
                                : this.props.listings && this.props.listings.length
                                    ? <BuyNowList/>
                                    : <NoData/>}
                            {(this.props.listings && this.props.listings.length) && this.props.listingsInProgress
                                ? <SkeletonLoader type="nft-card"/> : null}
                        </div>}
                    {this.props.tabValue === 'auctions' &&
                        <div
                            className="lists">{this.props.auctionListings && (this.props.auctionListings.length === 0) &&
                        this.props.auctionListingsInProgress
                                ? <SkeletonLoader type="nft-card"/>
                                : this.props.auctionListings && this.props.auctionListings.length
                                    ? <AuctionsList/>
                                    : <NoData/>}
                            {(this.props.auctionListings && this.props.auctionListings.length) && this.props.auctionListingsInProgress
                                ? <SkeletonLoader type="nft-card"/> : null}
                        </div>}
                    {this.props.tabValue === 'launchpad' &&
                        <div className="lists collection_list">
                            {this.props.launchpadCollections && (this.props.launchpadCollections.length === 0) && this.props.launchpadCollectionsInProgress
                                ? <SkeletonLoader type="collection-card"/>
                                : this.props.launchpadCollections && this.props.launchpadCollections.length
                                    ? <LaunchpadList/>
                                    : <NoData/>}
                            {(this.props.launchpadCollections && this.props.launchpadCollections.length) && this.props.launchpadCollectionsInProgress
                                ? <SkeletonLoader type="collection-card"/> : null}
                        </div>}
                </div>
                <div className="right_panel">
                    {this.props.tabValue === 'launchpad'
                        ? null
                        : this.props.tabValue === 'auctions'
                            ? <FiltersAuctions/>
                            : <Filters/>}
                    <ActiveCard/>
                </div>
                <DeListDialog/>
                <ListDialog/>
                <TransferDialog/>
                <BuyNFTDialogResponse/>
                <PlaceBidDialog/>
            </div>
        );
    }
}

MarketPlace.propTypes = {
    address: PropTypes.string.isRequired,
    auctionListings: PropTypes.array.isRequired,
    auctionListingsInProgress: PropTypes.bool.isRequired,
    auctionListingsLimit: PropTypes.number.isRequired,
    auctionListingsSkip: PropTypes.number.isRequired,
    auctionListingsSortBy: PropTypes.string.isRequired,
    auctionsTypeLA: PropTypes.string.isRequired,
    denomValue: PropTypes.object.isRequired,
    denomValueLA: PropTypes.object.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    fetchLaunchpadCollections: PropTypes.func.isRequired,
    fetchListings: PropTypes.func.isRequired,
    fetchStats: PropTypes.func.isRequired,
    filterShow: PropTypes.bool.isRequired,
    filterShowLA: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    hideListingAuctionFilters: PropTypes.func.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    launchpadCollections: PropTypes.array.isRequired,
    launchpadCollectionsInProgress: PropTypes.bool.isRequired,
    launchpadCollectionsLimit: PropTypes.number.isRequired,
    launchpadCollectionsSearch: PropTypes.string.isRequired,
    launchpadCollectionsSkip: PropTypes.number.isRequired,
    listingSearch: PropTypes.string.isRequired,
    listings: PropTypes.array.isRequired,
    listingsInProgress: PropTypes.bool.isRequired,
    listingsLimit: PropTypes.number.isRequired,
    listingsSkip: PropTypes.number.isRequired,
    priceRange: PropTypes.array.isRequired,
    priceRangeLA: PropTypes.array.isRequired,
    priceRangeValue: PropTypes.object.isRequired,
    priceRangeValueLA: PropTypes.object.isRequired,
    setLAOnSaleIn: PropTypes.func.isRequired,
    setMarketPlaceTab: PropTypes.func.isRequired,
    setOnSaleIn: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showFilters: PropTypes.func.isRequired,
    showListingAuctionFilters: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    statsData: PropTypes.object.isRequired,
    statsInProgress: PropTypes.bool.isRequired,
    tabValue: PropTypes.string.isRequired,
    auctionListingsOrder: PropTypes.string,
    auctionListingsSearch: PropTypes.string,
    auctionListingsTotal: PropTypes.number,
    child: PropTypes.bool,
    launchpadCollectionsTotal: PropTypes.number,
    listingsTotal: PropTypes.number,
    order: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        denomValue: state.filters.onSaleIn.value,
        filterShow: state.filters.show,
        priceRangeValue: state.filters.priceRange.value,
        priceRange: state.filters.priceRange.range,

        auctionsTypeLA: state.auctions.filters.auctionsTypeLA,
        denomValueLA: state.auctions.filters.onSaleInLA.value,
        filterShowLA: state.auctions.filters.showLA,
        priceRangeValueLA: state.auctions.filters.priceRangeLA.value,
        priceRangeLA: state.auctions.filters.priceRangeLA.range,

        show: state.explore.activeCard.open,

        listings: state.marketplace.listings.result,
        listingsInProgress: state.marketplace.listings.inProgress,
        listingsTotal: state.marketplace.listings.total,
        listingsSkip: state.marketplace.listings.skip,
        listingSearch: state.marketplace.listingSearch.value,
        listingsLimit: state.marketplace.listings.limit,
        sortBy: state.marketplace.listingSort.sortBy,
        order: state.marketplace.listingSort.order,

        auctionListings: state.auctions.auctionListings.result,
        auctionListingsInProgress: state.auctions.auctionListings.inProgress,
        auctionListingsTotal: state.auctions.auctionListings.total,
        auctionListingsSkip: state.auctions.auctionListings.skip,
        auctionListingsSearch: state.auctions.search.value,
        auctionListingsLimit: state.auctions.auctionListings.limit,
        auctionListingsSortBy: state.auctions.sort.sortBy,
        auctionListingsOrder: state.auctions.sort.order,

        launchpadCollections: state.marketplace.launchpadCollections.result,
        launchpadCollectionsInProgress: state.marketplace.launchpadCollections.inProgress,
        launchpadCollectionsTotal: state.marketplace.launchpadCollections.total,
        launchpadCollectionsSkip: state.marketplace.launchpadCollections.skip,
        launchpadCollectionsSearch: state.home.launchpadCollectionSearch.value,
        launchpadCollectionsLimit: state.marketplace.launchpadCollections.limit,

        tabValue: state.marketplace.marketPlaceTab.value,
        statsData: state.home.stats.result,
        statsInProgress: state.home.stats.inProgress,
        keys: state.account.wallet.connection.keys,
    };
};

const actionToProps = {
    fetchListings,
    fetchAuctionsListings,
    fetchLaunchpadCollections: fetchLaunchpadCollectionsList,
    hide: hideActiveCard,
    setMarketPlaceTab,
    showFilters,
    hideFilters,
    setOnSaleIn,
    hideListingAuctionFilters,
    showListingAuctionFilters,
    setLAOnSaleIn,
    fetchStats,
};

export default connect(stateToProps, actionToProps)(MarketPlace);
