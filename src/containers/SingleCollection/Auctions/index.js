import React from 'react';
import '../index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../utils/variables';
import Filters from './Filters';
import ActiveCard from '../../MarketPlace/ActiveCard';
import ClassNames from 'classnames';
import { hideActiveCard } from '../../../actions/explore';
import SortByPopover from './SortByPopover';
import { IconButton } from '@mui/material';
import { ReactComponent as FilterButton } from '../../../assets/explore/filter.svg';
import NoData from '../../../components/NoData';
import SearchTextField from './Search';
import Card from '../../MarketPlace/Auctions/Card';
import { hideCollectionAuctionFilters, showCollectionAuctionFilters } from '../../../actions/auctions/filters';
import SkeletonLoader from '../../../components/SkeletonLoader';

class Auctions extends React.Component {
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
                            {this.props.auctions && this.props.auctionsInProgress &&
                            ((this.props.auctions && this.props.auctions.length === 0))
                                ? null
                                : <>
                                    {variables[this.props.lang].results}{' : '}
                                    {this.props.auctionsTotal ? this.props.auctionsTotal : 0}
                                </>}
                            <div className="listed_search">
                                <SearchTextField/>
                            </div>
                        </div>
                        <div className="explore_head_right">
                            <SortByPopover/>
                            <IconButton
                                className={this.props.filterShow ? 'active_button' : 'default_button'}
                                onClick={this.handleFilter}>
                                <FilterButton/>
                            </IconButton>
                        </div>
                    </div>

                    <div className="lists">
                        {(this.props.auctions && (this.props.auctions.length === 0) &&
                            this.props.auctionsInProgress)
                            ? <SkeletonLoader type="nft-card"/>
                            : this.props.auctions && this.props.auctions.length > 0
                                ? this.props.auctions.map((item, index) => {
                                    return <Card
                                        key={index} filterShow={this.props.filterShow}
                                        hideFilters={this.props.hideFilters} index={index} item={item}/>;
                                })
                                : <NoData/>}
                        {(this.props.auctions && this.props.auctions.length && this.props.auctionsInProgress)
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

Auctions.propTypes = {
    activeTab: PropTypes.string.isRequired,
    auctions: PropTypes.object.isRequired,
    auctionsInProgress: PropTypes.bool.isRequired,
    filterShow: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    hideFilters: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    showFilters: PropTypes.func.isRequired,
    auctionsTotal: PropTypes.number,
    child: PropTypes.bool,
};

const stateToProps = (state) => {
    return {
        filterShow: state.auctions.filters.showCA,
        show: state.explore.activeCard.open,
        lang: state.language,
        auctions: state.collection.auctions.result,
        auctionsInProgress: state.collection.auctions.inProgress,
        auctionsTotal: state.collection.auctions.total,
    };
};

const actionToProps = {
    showFilters: showCollectionAuctionFilters,
    hideFilters: hideCollectionAuctionFilters,
    hide: hideActiveCard,
};

export default connect(stateToProps, actionToProps)(Auctions);
