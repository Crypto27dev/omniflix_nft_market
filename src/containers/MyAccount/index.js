import React, { Component } from 'react';
import './index.css';
import '../SingleCollection/index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { withRouter } from 'react-router';
import DotsLoading from '../../components/DotsLoading';
import Icon from '../../components/Icon';
import ClassNames from 'classnames';
import { Tab, Tabs } from '@mui/material';
import { clearMyAccountData, fetchUserBalance, fetchUserCollections, fetchUserNFTs } from '../../actions/myAccount';
import { fetchUserActivity } from '../../actions/activity';
import { DEFAULT_LAZY_FETCH_HEIGHT, DEFAULT_LIMIT, DEFAULT_ORDER, DEFAULT_SKIP, DEFAULT_SORT_BY } from '../../config';
import PlaceBidDialog from '../MarketPlace/ActiveCard/PlaceBid/PlaceBidDialog';
import BurnDialog from '../MarketPlace/BurnDialog';
import MenuPopover from '../MarketPlace/MenuPopover';
import DeListDialog from '../MarketPlace/ActiveCard/DeList/DeListDialog';
import TransferDialog from '../MarketPlace/ActiveCard/TransferSell/TransferDialog';
import ListDialog from '../MarketPlace/ActiveCard/TransferSell/ListDialog';
import BuyNFTDialogResponse from '../MarketPlace/ActiveCard/PurchaseCard/BuyNFTDialogResponse';
import MyAccountSkeletonLoader from '../../components/SkeletonLoader/MyAccount';
import IBCTokens from './IBCTokens';
import ListingPage from './Owned/ListingPage';
import Activity from './Activity';

class MyAccount extends Component {
    constructor (props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            show: false,
            value: 'nfts',
            fix: false,
        };

        this.handleCopy = this.handleCopy.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount () {
        this.props.clearMyAccountData();
        const route = this.props.match && this.props.match.params && this.props.match.params.tab;

        if (route === undefined || route === '') {
            this.setState({
                value: 'nfts',
            });
        } else {
            if (this.state.value !== route) {
                this.setState({
                    value: route,
                });
            }
        }

        if (this.props.match && this.props.match.params && this.props.match.params.address) {
            if (route === 'nfts' || route === undefined || route === '') {
                this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (route === 'collections' && this.props.collections &&
                !this.props.collections.length && !this.props.collectionsInProgress) {
                this.props.fetchUserCollections(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (route === 'activity' && this.props.activities &&
                !this.props.activities.length && !this.props.activitiesInProgress) {
                this.props.fetchUserActivity(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT, DEFAULT_SORT_BY, DEFAULT_ORDER);
            }
            if (route === 'ibc_tokens' && this.props.userBalance &&
                !this.props.userBalance.length && !this.props.userBalanceInProgress) {
                this.props.fetchUserBalance(this.props.match.params.address);
            }
        }

        window.addEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.match.params !== this.props.match.params) {
            const value = this.props.match && this.props.match.params && this.props.match.params.tab;

            if (value === '' || value === undefined) {
                this.setState({
                    value: 'nfts',
                });
            } else {
                if (value !== this.state.value) {
                    this.setState({
                        value: value,
                    });
                }
            }
        }

        if ((pp.match.params.address) !== (this.props.match && this.props.match.params && this.props.match.params.address)) {
            this.props.fetchUserCollections(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            this.props.fetchUserActivity(this.props.match.params.address, 0, 10, DEFAULT_SORT_BY, DEFAULT_ORDER);
            this.props.fetchUserBalance(this.props.match.params.address);
        }
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll () {
        const header = this.myRef.current;
        const scroll = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight;
        const height = window.innerHeight;
        const route = this.props.match && this.props.match.params && this.props.match.params.tab;

        if ((this.props.nftSList.length < this.props.nftSTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            (route === 'nfts' || route === undefined || route === '') && !(this.props.nftSInProgress) &&
            (this.props.match && this.props.match.params && this.props.match.params.address)) {
            this.props.fetchUserNFTs(this.props.match.params.address, this.props.nftSSkip + DEFAULT_LIMIT, this.props.nftSLimit);
        }
        if ((this.props.collections.length < this.props.collectionsTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            (route === 'collections') && !(this.props.collectionsInProgress) &&
            this.props.match && this.props.match.params && this.props.match.params.address) {
            this.props.fetchUserCollections(this.props.match.params.address, this.props.collectionsSkip + DEFAULT_LIMIT, this.props.collectionsLimit);
        }

        if ((this.props.activities.length < this.props.activitiesTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            (route === 'activity') && !(this.props.activitiesInProgress) &&
            this.props.match && this.props.match.params && this.props.match.params.address) {
            this.props.fetchUserActivity(this.props.match.params.address, this.props.activitiesSkip + DEFAULT_LIMIT, this.props.activitiesLimit);
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

    handleClose () {
        this.setState({
            show: false,
        });
    }

    handleCopy () {
        const address = this.props.match && this.props.match.params && this.props.match.params.address;
        if (address) {
            navigator.clipboard.writeText(address);

            this.setState({
                show: true,
            });
            setTimeout(this.handleClose, 1000);
        }
    }

    handleChange (event, newValue) {
        if (this.props.match && this.props.match.params && this.props.match.params.address) {
            if (newValue === 'nfts' && this.props.nftSList && !this.props.nftSList.length && !this.props.nftSInProgress) {
                this.props.fetchUserNFTs(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (newValue === 'collections' && this.props.collections &&
                !this.props.collections.length && !this.props.collectionsInProgress) {
                this.props.fetchUserCollections(this.props.match.params.address, DEFAULT_SKIP, DEFAULT_LIMIT);
            }
            if (newValue === 'activity' && this.props.activities &&
                !this.props.activities.length && !this.props.activitiesInProgress) {
                this.props.fetchUserActivity(this.props.match.params.address, 0, 10, DEFAULT_SORT_BY, DEFAULT_ORDER);
            }
            if (newValue === 'ibc_tokens' && this.props.userBalance &&
                !this.props.userBalance.length && !this.props.userBalanceInProgress) {
                this.props.fetchUserBalance(this.props.match.params.address);
            }
        }

        if (newValue === this.state.value) {
            return;
        }

        const address = this.props.match && this.props.match.params && this.props.match.params.address;
        this.props.history.push(`/account/${address}/${newValue}`);
        this.setState({
            value: newValue,
        });
    }

    render () {
        const a11yProps = (index) => {
            return {
                id: `account-tab-${index}`,
                'aria-controls': `account-tab-panel-${index}`,
            };
        };
        const address = this.props.match && this.props.match.params && this.props.match.params.address;

        return (
            <div className={ClassNames('my_account', this.state.fix ? 'fix' : '')}>
                {this.props.inProgress
                    ? <MyAccountSkeletonLoader/>
                    : <>
                        <h2>{this.props.address === address
                            ? this.props.keys && this.props.keys.name : ''}</h2>
                        <div className="address" onClick={this.handleCopy}>
                            {this.props.inProgress && address === ''
                                ? <DotsLoading/>
                                : <p>{address}</p>}
                            <Icon className="copy" icon="copy"/>
                            <div className={ClassNames('copy_text', this.state.show ? 'show' : '')}>
                                {this.state.show ? variables[this.props.lang].copied : variables[this.props.lang]['copy_to_clipboard']}
                            </div>
                        </div>
                    </>}
                <Tabs
                    ref={this.myRef}
                    centered
                    className={ClassNames('horizontal_tabs', this.state.fix ? 'sticky' : '')}
                    id="sticky-tabs"
                    value={this.state.value}
                    onChange={this.handleChange}>
                    <div className="address_div">
                        <div className="address" onClick={this.handleCopy}>
                            {this.props.inProgress && address === ''
                                ? <DotsLoading/>
                                : <span>{address}</span>}
                            <Icon className="copy" icon="copy"/>
                            <div className={ClassNames('copy_text', this.state.show ? 'show' : '')}>
                                {this.state.show ? variables[this.props.lang].copied : variables[this.props.lang]['copy_to_clipboard']}
                            </div>
                        </div>
                    </div>

                    <Tab
                        className={'tab ' + (this.state.value === 'nfts' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].nfts}</p>}
                        value="nfts"
                        {...a11yProps(0)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'collections' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].collections}</p>}
                        value="collections"
                        {...a11yProps(1)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'activity' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].activity}</p>}
                        value="activity"
                        {...a11yProps(2)} />
                    <Tab
                        className={'tab ' + (this.state.value === 'ibc_tokens' ? 'active_tab' : '')}
                        label={<p className="text">{variables[this.props.lang].ibc_tokens}</p>}
                        value="ibc_tokens"
                        {...a11yProps(3)} />
                    {/* <Tab */}
                    {/*    className={'tab ' + (this.state.value === 'offers' ? 'active_tab' : '')} */}
                    {/*    label={<p className="text">{variables[this.props.lang].offers}</p>} */}
                    {/*    value="offers" */}
                    {/*    {...a11yProps(3)} /> */}
                </Tabs>
                {this.state.value === 'collections' &&
                    <ListingPage child="collections"/>}
                {this.state.value === 'nfts' &&
                    <ListingPage child="nfts"/>}
                {this.state.value === 'activity' && <div className="activity_table">
                    <div className="activities_list">
                        <Activity/>
                    </div>
                </div>}
                {this.state.value === 'ibc_tokens' &&
                    <div className="activity_table ibc_tokens_table">
                        <IBCTokens/>
                    </div>}
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

MyAccount.propTypes = {
    activities: PropTypes.array.isRequired,
    activitiesInProgress: PropTypes.bool.isRequired,
    activitiesLimit: PropTypes.number.isRequired,
    activitiesSkip: PropTypes.number.isRequired,
    activitiesTotal: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    clearMyAccountData: PropTypes.func.isRequired,
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
    collectionsLimit: PropTypes.number.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    collectionsTotal: PropTypes.number.isRequired,
    fetchUserActivity: PropTypes.func.isRequired,
    fetchUserBalance: PropTypes.func.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    inProgress: PropTypes.bool.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    nftSInProgress: PropTypes.bool.isRequired,
    nftSLimit: PropTypes.number.isRequired,
    nftSList: PropTypes.array.isRequired,
    nftSSkip: PropTypes.number.isRequired,
    nftSTotal: PropTypes.number.isRequired,
    userBalance: PropTypes.array.isRequired,
    userBalanceInProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        activities: state.activity.userActivity.result,
        activitiesInProgress: state.activity.userActivity.inProgress,
        activitiesSkip: state.activity.userActivity.skip,
        activitiesLimit: state.activity.userActivity.limit,
        activitiesTotal: state.activity.userActivity.total,
        address: state.account.wallet.connection.address,
        inProgress: state.account.wallet.connection.inProgress,
        lang: state.language,
        userBalance: state.myAccount.userBalance.value,
        userBalanceInProgress: state.myAccount.userBalance.inProgress,

        collectionsTotal: state.myAccount.userCollections.count,
        collectionsInProgress: state.myAccount.userCollections.inProgress,
        collectionsLimit: state.myAccount.userCollections.limit,
        collectionsSkip: state.myAccount.userCollections.skip,
        collections: state.myAccount.userCollections.result,

        nftSList: state.myAccount.userNFTs.result,
        nftSInProgress: state.myAccount.userNFTs.inProgress,
        nftSTotal: state.myAccount.userNFTs.count,
        nftSSkip: state.myAccount.userNFTs.skip,
        nftSLimit: state.myAccount.userNFTs.limit,
        keys: state.account.wallet.connection.keys,
    };
};

const actionToProps = {
    clearMyAccountData,
    fetchUserCollections,
    fetchUserNFTs,
    fetchUserActivity,
    fetchUserBalance,
};

export default withRouter(connect(stateToProps, actionToProps)(MyAccount));
