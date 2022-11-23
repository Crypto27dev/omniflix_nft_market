import React from 'react';
import '../index.css';
import '../../MarketPlace/index.css';
import CollectionList from './CollectionList';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import Filters from '../../MarketPlace/Filters';
import { hideFilters, showFilters } from '../../../actions/filters';
import ActiveCard from '../../MarketPlace/ActiveCard';
import ClassNames from 'classnames';
import { hideActiveCard } from '../../../actions/explore';
import NFTsList from './NFTsList';
import { fetchUserCollections, fetchUserNFTs } from '../../../actions/myAccount';
import { withRouter } from 'react-router';
import NoData from '../../../components/NoData';
import SkeletonLoader from '../../../components/SkeletonLoader';

class ListingPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            grid: false,
        };

        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount () {
        document.body.style.overflow = null;
        const elements = document.getElementsByClassName('scroll_bar');

        for (let i = 0, len = elements.length; i < len; i++) {
            elements[i].style.overflow = 'unset';
        }
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

    render () {
        return (
            <div className={ClassNames('explore_main',
                this.props.filterShow ? 'show_filter' : '',
                this.props.show ? 'show_active_card' : '')}>
                <div className="explore scroll_bar">
                    <div className="explore_header">
                        <span className="explore_head_left">
                            {variables[this.props.lang].results}{' : '}
                            {this.props.child === 'collections'
                                ? (this.props.collections && this.props.collections.length > 0 && this.props.collectionsTotal)
                                    ? this.props.collectionsTotal
                                    : 0
                                : this.props.child === 'nfts'
                                    ? (this.props.nftSList && this.props.nftSList.length > 0 && this.props.nftSTotal)
                                        ? this.props.nftSTotal
                                        : 0
                                    : 0}
                        </span>
                        <div className="explore_head_right">
                            {/* <SortByPopover/> */}
                            {/* <IconButton */}
                            {/*    className={this.state.grid ? 'active_button' : 'default_button'} */}
                            {/*    onClick={() => this.handleOptions('grid')}> */}
                            {/*    <GridButton/> */}
                            {/* </IconButton> */}
                            {/* <IconButton */}
                            {/*    className={this.props.filterShow ? 'active_button' : 'default_button'} */}
                            {/*    onClick={this.handleFilter}> */}
                            {/*    <FilterButton/> */}
                            {/* </IconButton> */}
                        </div>
                    </div>
                    <div className="owner_nfts lists">
                        {this.props.child === 'nfts'
                            ? this.props.nftSList && (this.props.nftSList.length === 0) &&
                            this.props.nftSInProgress && this.props.child === 'nfts'
                                ? <SkeletonLoader type="nft-card"/>
                                : (this.props.nftSList && this.props.nftSList.length && this.props.child === 'nfts')
                                    ? <NFTsList/>
                                    : <NoData/>
                            : null}
                        {(this.props.nftSList && this.props.nftSList.length) && this.props.nftSInProgress &&
                        (this.props.child === 'nfts')
                            ? <SkeletonLoader type="nft-card"/> : null}
                    </div>

                    <div className="lists collection_list">
                        {this.props.child === 'collections'
                            ? this.props.collections && (this.props.collections.length === 0) &&
                            this.props.collectionsInProgress && this.props.child === 'collections'
                                ? <SkeletonLoader type="collection-card"/>
                                : (this.props.collections && this.props.collections.length && this.props.child === 'collections')
                                    ? <CollectionList/>
                                    : <NoData/>
                            : null}
                        {(this.props.collections && this.props.collections.length) && this.props.collectionsInProgress &&
                        (this.props.child === 'collections')
                            ? <SkeletonLoader type="collection-card"/> : null}
                    </div>
                </div>
                <div className="right_panel">
                    <Filters/>
                    {this.props.child === 'nfts' && <ActiveCard/>}
                </div>
            </div>
        );
    }
}

ListingPage.propTypes = {
    address: PropTypes.string.isRequired,
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
    collectionsTotal: PropTypes.number.isRequired,
    fetchUserCollections: PropTypes.func.isRequired,
    fetchUserNFTs: PropTypes.func.isRequired,
    filterShow: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    nftSInProgress: PropTypes.bool.isRequired,
    nftSList: PropTypes.array.isRequired,
    nftSTotal: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    showFilters: PropTypes.func.isRequired,
    child: PropTypes.string,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        filterShow: state.filters.show,
        show: state.explore.activeCard.open,
        lang: state.language,

        collections: state.myAccount.userCollections.result,
        collectionsTotal: state.myAccount.userCollections.count,
        collectionsInProgress: state.myAccount.userCollections.inProgress,

        nftSInProgress: state.myAccount.userNFTs.inProgress,
        nftSTotal: state.myAccount.userNFTs.count,
        nftSList: state.myAccount.userNFTs.result,
    };
};

const actionToProps = {
    showFilters,
    hideFilters,
    hide: hideActiveCard,
    fetchUserCollections,
    fetchUserNFTs,
};

export default withRouter(connect(stateToProps, actionToProps)(ListingPage));
