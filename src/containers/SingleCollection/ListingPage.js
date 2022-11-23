import React from 'react';
import './index.css';
import List from './List';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import Filters from './Filters';
import ActiveCard from '../MarketPlace/ActiveCard';
import ClassNames from 'classnames';
import { hideActiveCard } from '../../actions/explore';
import SortByPopover from './SortByPopover';
import { IconButton } from '@mui/material';
import { ReactComponent as FilterButton } from '../../assets/explore/filter.svg';
import NoData from '../../components/NoData';
import SearchTextField from './SearchListedTextField';
import SearchNotListedTextField from './SearchNonListedTextField';
import MyNFTs from './MyNFTs';
import { hideCollectionFilters, showCollectionFilters } from '../../actions/collections/filters';
import SkeletonLoader from '../../components/SkeletonLoader';

class MarketPlace extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            grid: false,
        };

        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount () {
        if (!this.props.child) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
            const elements = document.getElementsByClassName('scroll_bar');

            for (let i = 0, len = elements.length; i < len; i++) {
                elements[i].style.overflow = 'unset';
            }
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
                        <div className="explore_head_left">
                            {this.props.listed && this.props.listedNFTsInProgress &&
                            ((this.props.listedNFTs && this.props.listedNFTs.length === 0))
                                ? null
                                : this.props.listed && <>
                                    {variables[this.props.lang].results}{' : '}
                                    {this.props.listedNFTsTotal ? this.props.listedNFTsTotal : 0}
                                </>}
                            {this.props.notListed && this.props.nonListedNFTsInProgress &&
                            ((this.props.nonListedNFTs && this.props.nonListedNFTs.length === 0))
                                ? null
                                : this.props.notListed && <>
                                    {variables[this.props.lang].results}{' : '}
                                    {this.props.nonListedNFTsTotal ? this.props.nonListedNFTsTotal : 0}
                                </>}
                            {this.props.myNfts && this.props.myNFTsInProgress &&
                            ((this.props.myNFTsList && this.props.myNFTsList.length === 0))
                                ? null
                                : this.props.myNfts && <>
                                    {variables[this.props.lang].results}{' : '}
                                    {this.props.myNFTsTotal ? this.props.myNFTsTotal : 0}
                                </>}
                            {this.props.listed &&
                                <div className="listed_search">
                                    <SearchTextField/>
                                </div>}
                            {this.props.notListed &&
                                <div className="listed_search">
                                    <SearchNotListedTextField/>
                                </div>}
                        </div>
                        {this.props.listed &&
                            <div className="explore_head_right">
                                <SortByPopover/>
                                {/* <IconButton */}
                                {/*   className={this.state.grid ? 'active_button' : 'default_button'} */}
                                {/*   onClick={() => this.handleOptions('grid')}> */}
                                {/*   <GridButton/> */}
                                {/* </IconButton> */}
                                <IconButton
                                    className={this.props.filterShow ? 'active_button' : 'default_button'}
                                    onClick={this.handleFilter}>
                                    <FilterButton/>
                                </IconButton>
                            </div>}
                    </div>

                    <div className="collection_nfts lists">
                        {((this.props.listedNFTs && this.props.listed &&
                            (this.props.listedNFTs.length === 0) && (this.props.listedNFTsInProgress || this.props.collectionInProgress))) ||
                        ((this.props.nonListedNFTs && this.props.notListed &&
                            (this.props.nonListedNFTs.length === 0) && (this.props.nonListedNFTsInProgress || this.props.collectionInProgress))) ||
                        ((this.props.myNFTsList && this.props.myNfts &&
                            (this.props.myNFTsList.length === 0) && (this.props.myNFTsInProgress || this.props.collectionInProgress)))
                            ? <SkeletonLoader type="nft-card"/>
                            : this.props.listedNFTs &&
                            this.props.listedNFTs.length > 0 && this.props.listed
                                ? <List listData={this.props.listedNFTs}/>
                                : this.props.nonListedNFTs &&
                                this.props.nonListedNFTs.length > 0 && this.props.notListed
                                    ? <List listData={this.props.nonListedNFTs}/>
                                    : this.props.myNFTsList &&
                                    this.props.myNFTsList.length > 0 && this.props.myNfts
                                        ? <MyNFTs nftSList={this.props.myNFTsList}/>
                                        : <NoData/>}
                        {((this.props.nonListedNFTs && this.props.notListed &&
                            this.props.nonListedNFTs.length && (this.props.nonListedNFTsInProgress || this.props.collectionInProgress))) ||
                        ((this.props.listedNFTs && this.props.listed &&
                            this.props.listedNFTs.length && (this.props.listedNFTsInProgress || this.props.collectionInProgress))) ||
                        ((this.props.myNFTsList && this.props.myNfts &&
                            this.props.myNFTsList.length && (this.props.myNFTsInProgress || this.props.collectionInProgress)))
                            ? <SkeletonLoader type="nft-card"/> : null}
                    </div>
                </div>
                <div className="right_panel">
                    <Filters activeTab={this.props.activeTab}/>
                    <ActiveCard/>
                </div>
            </div>
        );
    }
}

MarketPlace.propTypes = {
    activeTab: PropTypes.string.isRequired,
    collectionInProgress: PropTypes.bool.isRequired,
    collectionList: PropTypes.object.isRequired,

    filterShow: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    listedNFTs: PropTypes.array.isRequired,
    listedNFTsInProgress: PropTypes.bool.isRequired,
    listedNFTsTotal: PropTypes.number.isRequired,
    myNFTsInProgress: PropTypes.bool.isRequired,
    myNFTsList: PropTypes.array.isRequired,
    myNFTsTotal: PropTypes.number.isRequired,
    nonListedNFTs: PropTypes.array.isRequired,
    nonListedNFTsInProgress: PropTypes.bool.isRequired,
    nonListedNFTsTotal: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    showFilters: PropTypes.func.isRequired,
    child: PropTypes.bool,
    listed: PropTypes.bool,
    myNfts: PropTypes.bool,
    notListed: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        filterShow: state.collection.filters.showCollectionFilter,
        show: state.explore.activeCard.open,
        lang: state.language,
        collectionList: state.marketplace.collection.result,
        collectionInProgress: state.marketplace.collection.inProgress,

        listedNFTs: state.collection.listedCollectionNFTs.result,
        listedNFTsInProgress: state.collection.listedCollectionNFTs.inProgress,
        listedNFTsTotal: state.collection.listedCollectionNFTs.total,
        nonListedNFTs: state.collection.nonListedCollectionNFTs.result,
        nonListedNFTsInProgress: state.collection.nonListedCollectionNFTs.inProgress,
        nonListedNFTsTotal: state.collection.nonListedCollectionNFTs.total,
        myNFTsList: state.collection.collectionMyNFTs.result,
        myNFTsInProgress: state.collection.collectionMyNFTs.inProgress,
        myNFTsTotal: state.collection.collectionMyNFTs.total,
    };
};

const actionToProps = {
    showFilters: showCollectionFilters,
    hideFilters: hideCollectionFilters,
    hide: hideActiveCard,
};

export default connect(stateToProps, actionToProps)(MarketPlace);
