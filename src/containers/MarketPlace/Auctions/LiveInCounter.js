import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { ReactComponent as AuctionIcon } from '../../../assets/auction/live.svg';
import variables from '../../../utils/variables';
import { connect } from 'react-redux';
import { fetchAuctionsListings } from '../../../actions/auctions';
import { hideActiveCard } from '../../../actions/explore';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../config';
import { fetchCollectionAuctions } from '../../../actions/collections';
import { withRouter } from 'react-router';
import { fetchUserNFTs } from '../../../actions/myAccount';

const LiveInCounter = (props) => {
    const [time, setTime] = useState();
    const [status, setStatus] = useState(true);
    const [timerObj] = useState({ timer: false });
    const { auction } = props;

    useEffect(() => {
        if (auction && !Object.keys(auction).length) {
            return;
        }

        if (auction && auction.start_time && (moment().diff(auction.start_time) < -1000)) {
            if (timerObj.timer) {
                clearTimeout(timerObj.timer);
            }

            handleTimer(new Date(auction.start_time).getTime());
        } else {
            setStatus(false);
        }

        return () => {
            if (timerObj.timer) {
                clearTimeout(timerObj.timer);
            }
        };
        /* eslint-disable */
    }, [auction]);

    const handleTimer = (endTime) => {
        const now = new Date().getTime();
        const distance = endTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const obj = {
            days,
            hours,
            minutes,
            seconds,
        };

        setTime(obj);

        if (distance > 0) {
            timerObj.timer = setTimeout(() => handleTimer(endTime), 1000);
        } else {
            setStatus(false);
            if (props.show) {
                props.hide();
            }

            if (props.match && props.match.params && props.match.params.id && !props.activitiesInProgress) {
                if (props.denomValueCA && props.denomValueCA.size) {
                    props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, [...props.denomValueCA], null, null,
                        props.auctionsTypeCA, props.address, props.sortByCA, props.orderCA, props.listingSearchCA);
                } else if (props.priceRangeValueCA && props.priceRangeValueCA.network &&
                    props.priceRangeCA && props.priceRangeCA.length &&
                    ((props.priceRangeCA[0] > 0) || (props.priceRangeCA[1] < 50000))) {
                    const decimals = props.priceRangeValueCA && props.priceRangeValueCA.network &&
                        (props.priceRangeValueCA.network.COIN_DECIMALS || props.priceRangeValueCA.network.decimals);
                    const minValue = props.priceRangeCA[0] * (10 ** decimals);
                    const maxValue = props.priceRangeCA[1] * (10 ** decimals);

                    props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT,
                        [props.priceRangeValueCA.ibc_denom_hash || props.priceRangeValueCA.value],
                        minValue, maxValue, props.auctionsTypeCA, props.address, props.sortByCA, props.orderCA, props.listingSearchCA);
                } else {
                    props.fetchCollectionAuctions(route, DEFAULT_SKIP, DEFAULT_LIMIT, null, null, null,
                        props.auctionsTypeCA, props.address, props.sortByCA, props.orderCA, props.listingSearchCA);
                }
            } else if (props.match && props.match.params && props.match.params.address && !props.nftSInProgress) {
                props.fetchUserNFTs(props.match.params.address, DEFAULT_SKIP, props.nftSSkip + DEFAULT_LIMIT);
            } else if (!props.auctionListingsInProgress) {
                if (props.denomValueLA && props.denomValueLA.size) {
                    props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT, [...props.denomValueLA], null, null,
                        props.auctionsTypeLA, props.address, props.sortBy, props.order, props.listingSearch);
                } else if (props.priceRangeValueLA && props.priceRangeValueLA.network &&
                    props.priceRangeLA && props.priceRangeLA.length &&
                    ((props.priceRangeLA[0] > 0) || (props.priceRangeLA[1] < 50000))) {
                    const decimals = props.priceRangeValueLA && props.priceRangeValueLA.network &&
                        (props.priceRangeValueLA.network.COIN_DECIMALS || props.priceRangeValueLA.network.decimals);
                    const minValue = props.priceRangeLA[0] * (10 ** decimals);
                    const maxValue = props.priceRangeLA[1] * (10 ** decimals);

                    props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT,
                        [props.priceRangeValueLA.ibc_denom_hash || props.priceRangeValueLA.value],
                        minValue, maxValue, props.auctionsTypeLA, props.address, props.sortBy, props.order, props.listingSearch);
                } else {
                    props.fetchAuctionsListings(DEFAULT_SKIP, props.auctionListingsSkip + DEFAULT_LIMIT, null, null, null, props.auctionsTypeLA, props.address,
                        props.sortBy, props.order, props.listingSearch);
                }
            }
        }
    };

    return (
        status &&
        <div>
            <AuctionIcon/>
            {variables[props.lang]['starts_in']}{':'}
            <span>
                &nbsp;
                {time && time.days ? time.days + 'D ' : ''}
                {time && time.hours ? time.hours + 'H ' : ''}
                {time && time.minutes ? time.minutes + 'M ' : ''}
                {time && time.seconds ? time.seconds + 'S ' : '00S'}
                &nbsp;
            </span>
        </div>
    );
};

LiveInCounter.propTypes = {
    address: PropTypes.string.isRequired,
    activitiesInProgress: PropTypes.bool.isRequired,
    auctionListingsInProgress: PropTypes.bool.isRequired,
    auctionListingsSkip: PropTypes.number.isRequired,
    auctionsTypeLA: PropTypes.string.isRequired,
    auctionsTypeCA: PropTypes.string.isRequired,
    denomValueLA: PropTypes.object.isRequired,
    denomValueCA: PropTypes.object.isRequired,
    fetchAuctionsListings: PropTypes.func.isRequired,
    fetchCollectionAuctions: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    listingSearch: PropTypes.string.isRequired,
    listingSearchCA: PropTypes.string.isRequired,
    priceRangeLA: PropTypes.array.isRequired,
    priceRangeCA: PropTypes.array.isRequired,
    priceRangeValueLA: PropTypes.object.isRequired,
    priceRangeValueCA: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortByCA: PropTypes.string.isRequired,
    auction: PropTypes.shape({
        start_time: PropTypes.string,
    }),
    auctionsSkip: PropTypes.number,
    auctionListingsSearch: PropTypes.string,
    auctionListingsTotal: PropTypes.number,
    order: PropTypes.string,
    orderCA: PropTypes.string,
    nftSInProgress: PropTypes.bool,
    nftSSkip: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        activitiesInProgress: state.activity.collectionActivity.inProgress,
        auctionsSkip: state.collection.auctions.skip,
        auctionListingsInProgress: state.auctions.auctionListings.inProgress,
        auctionListingsTotal: state.auctions.auctionListings.total,
        auctionListingsSearch: state.auctions.auctionListings.value,
        auctionListingsSkip: state.auctions.auctionListings.skip,
        lang: state.language,
        sortBy: state.auctions.sort.sortBy,
        order: state.auctions.sort.order,
        show: state.explore.activeCard.open,
        nftSInProgress: state.myAccount.userNFTs.inProgress,
        nftSSkip: state.myAccount.userNFTs.skip,

        denomValueLA: state.auctions.filters.onSaleInLA.value,
        priceRangeValueLA: state.auctions.filters.priceRangeLA.value,
        priceRangeLA: state.auctions.filters.priceRangeLA.range,
        auctionsTypeLA: state.auctions.filters.auctionsTypeLA,
        listingSearch: state.marketplace.listingSearch.value,

        denomValueCA: state.auctions.filters.onSaleInCA.value,
        priceRangeValueCA: state.auctions.filters.priceRangeCA.value,
        priceRangeCA: state.auctions.filters.priceRangeCA.range,
        auctionsTypeCA: state.auctions.filters.auctionsTypeCA,
        listingSearchCA: state.collection.listedSearch.value,
        sortByCA: state.collection.collectionNFTsSort.sortBy,
        orderCA: state.collection.collectionNFTsSort.order,
    };
};

const actionToProps = {
    fetchAuctionsListings,
    fetchCollectionAuctions,
    fetchUserNFTs,
    hide: hideActiveCard,
};

export default withRouter(connect(stateToProps, actionToProps)(LiveInCounter));
