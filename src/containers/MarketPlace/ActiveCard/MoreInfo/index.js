import React from 'react';
import './index.css';
import { Button } from '@mui/material';
import Info from './Info';
// import Listings from './Listings';
import Activity from './Activity';
// import Offers from './Offers';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DEFAULT_LAZY_FETCH_HEIGHT, DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../../config';
import { fetchAuctionBidHistory, fetchNFTActivity } from '../../../../actions/marketplace';
import NoData from '../../../../components/NoData';
import DotsLoading from '../../../../components/DotsLoading';
import BidHistory from './BidHistory';
import MoreInfoSkeletonLoader from '../../../../components/SkeletonLoader/SingleAsset/MoreInfoSkeletonLoader';

class MoreInfo extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            active: 'moreInfo',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if ((prevProps.activeNFTID !== this.props.activeNFTID) && this.props.activeNFTID) {
            this.setState({
                active: 'moreInfo',
            });
        }
    }

    handleChange (event, value) {
        const activityShow = this.props.match && this.props.match.params && this.props.match.params.nftID;
        const auctionID = this.props.value && this.props.value.nftDetails &&
            this.props.value.nftDetails.auction && this.props.value.nftDetails.auction._id;
        this.setState({
            active: value,
        });
        if (!activityShow && value === 'activity' && this.props.activeNFTID && this.state.active !== 'activity') {
            this.props.fetchNFTActivity(this.props.activeNFTID, DEFAULT_SKIP, DEFAULT_LIMIT);
        }
        if (auctionID && value === 'bid_history' && this.state.active !== 'bid_history') {
            this.props.fetchAuctionBidHistory(auctionID, DEFAULT_SKIP, DEFAULT_LIMIT);
        }
    }

    handleScroll (e) {
        const scroll = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const height = e.target.clientHeight;
        const auctionID = this.props.value && this.props.value.nftDetails &&
            this.props.value.nftDetails.auction && this.props.value.nftDetails.auction._id;

        if ((this.props.nftActivities.length < this.props.nftActivitiesTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !(this.props.nftActivitiesInProgress)) {
            if (this.props.match && this.props.match.params && this.props.match.params.nftID) {
                this.props.fetchNFTActivity(this.props.match.params.nftID, this.props.nftActivitiesSkip + DEFAULT_LIMIT, this.props.nftActivitiesLimit);
            } else {
                this.props.fetchNFTActivity(this.props.activeNFTID, this.props.nftActivitiesSkip + DEFAULT_LIMIT, this.props.nftActivitiesLimit);
            }
        }

        if ((this.props.auctionBidHistory.length < this.props.auctionBidHistoryTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !(this.props.auctionBidHistoryInProgress) && auctionID && (this.state.active === 'bid_history')) {
            this.props.fetchAuctionBidHistory(auctionID, this.props.auctionBidHistorySkip + DEFAULT_LIMIT, this.props.auctionBidHistoryLimit);
        }
    }

    render () {
        const address = this.props.value && this.props.value.nftDetails &&
            this.props.value.nftDetails.owner;
        const auctionID = this.props.value && this.props.value.nftDetails &&
            this.props.value.nftDetails.auction && this.props.value.nftDetails.auction._id;

        return (
            <div className="more_info">
                <div className="tabs_section">
                    <Button
                        className={this.state.active === 'moreInfo' ? 'active_info' : 'default_info'}
                        onClick={(e) => this.handleChange(e, 'moreInfo')}>
                        More Info
                    </Button>
                    <Button
                        className={this.state.active === 'activity' ? 'active_info' : 'default_info'}
                        onClick={(e) => this.handleChange(e, 'activity')}>
                        Activity
                    </Button>
                    {auctionID &&
                        <Button
                            className={this.state.active === 'bid_history' ? 'active_info' : 'default_info'}
                            onClick={(e) => this.handleChange(e, 'bid_history')}>
                            Bid History
                        </Button>}
                </div>
                <div
                    className="tabs_data scroll_bar"
                    onScroll={this.handleScroll}>
                    {this.state.active === 'moreInfo' && <Info value={this.props.value}/>}
                    {this.state.active === 'owners' &&
                        <div className="info_section">
                            <div className="info_section1">
                                <span/>
                                <div className="info_profile">
                                    <span>Created By</span>
                                    <div className="hash_text" title={address}>
                                        <p className="name">{address}</p>
                                        {address.slice(address.length - 4, address.length)}
                                    </div>
                                </div>
                            </div>
                        </div>}

                    {/* activity */}
                    {(this.state.active === 'activity' && this.props.nftActivities &&
                        (this.props.nftActivities.length === 0) && this.props.nftActivitiesInProgress) ||
                    (this.state.active === 'activity' && this.props.activeNFTID !== '' &&
                        this.props.nftActivitiesID !== this.props.activeNFTID)
                        ? <MoreInfoSkeletonLoader/>
                        : this.state.active === 'activity' &&
                        this.props.nftActivities && this.props.nftActivities.length
                            ? <Activity
                                nftActivities={this.props.nftActivities}
                                nftActivitiesInProgress={this.props.nftActivitiesInProgress}/>
                            : this.state.active === 'activity' && <NoData/>}
                    {this.state.active === 'activity' &&
                    (this.props.nftActivities && this.props.nftActivities.length) &&
                    this.props.nftActivitiesInProgress
                        ? <DotsLoading/> : null}

                    {/* bid_history */}
                    {(this.state.active === 'bid_history' && this.props.auctionBidHistory &&
                        (this.props.auctionBidHistory.length === 0) && this.props.auctionBidHistoryInProgress)
                        ? <MoreInfoSkeletonLoader/>
                        : this.state.active === 'bid_history' &&
                        this.props.auctionBidHistory && this.props.auctionBidHistory.length
                            ? <BidHistory
                                list={this.props.auctionBidHistory}/>
                            : this.state.active === 'bid_history' && <NoData/>}
                    {this.state.active === 'bid_history' &&
                    (this.props.auctionBidHistory && this.props.auctionBidHistory.length) &&
                    this.props.auctionBidHistoryInProgress
                        ? <DotsLoading/> : null}
                </div>
            </div>
        );
    }
}

MoreInfo.propTypes = {
    address: PropTypes.string.isRequired,
    auctionBidHistory: PropTypes.array.isRequired,
    auctionBidHistoryInProgress: PropTypes.bool.isRequired,
    auctionBidHistoryLimit: PropTypes.number.isRequired,
    auctionBidHistorySkip: PropTypes.number.isRequired,
    auctionBidHistoryTotal: PropTypes.number.isRequired,
    fetchAuctionBidHistory: PropTypes.func.isRequired,
    fetchNFTActivity: PropTypes.func.isRequired,
    nftActivities: PropTypes.array.isRequired,
    nftActivitiesInProgress: PropTypes.bool.isRequired,
    nftActivitiesLimit: PropTypes.number.isRequired,
    nftActivitiesSkip: PropTypes.number.isRequired,
    nftActivitiesTotal: PropTypes.number.isRequired,
    value: PropTypes.object.isRequired,
    activeNFTID: PropTypes.string,
    auctionBidHistoryID: PropTypes.string,
    match: PropTypes.shape({
        params: PropTypes.shape({
            listID: PropTypes.string,
            denomID: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
    nftActivitiesID: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        activeNFTID: state.explore.activeCard.activeNFTID,
        address: state.account.wallet.connection.address,
        lang: state.language,
        nftActivities: state.marketplace.nftActivities.result,
        nftActivitiesInProgress: state.marketplace.nftActivities.inProgress,
        nftActivitiesTotal: state.marketplace.nftActivities.total,
        nftActivitiesSkip: state.marketplace.nftActivities.skip,
        nftActivitiesLimit: state.marketplace.nftActivities.limit,
        nftActivitiesID: state.marketplace.nftActivities.id,

        auctionBidHistory: state.marketplace.auctionBidHistory.result,
        auctionBidHistoryInProgress: state.marketplace.auctionBidHistory.inProgress,
        auctionBidHistoryTotal: state.marketplace.auctionBidHistory.total,
        auctionBidHistorySkip: state.marketplace.auctionBidHistory.skip,
        auctionBidHistoryLimit: state.marketplace.auctionBidHistory.limit,
        auctionBidHistoryID: state.marketplace.auctionBidHistory.id,
    };
};

const actionsToProps = {
    fetchNFTActivity,
    fetchAuctionBidHistory,
};

export default withRouter(connect(stateToProps, actionsToProps)(MoreInfo));
