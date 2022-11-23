import React from 'react';
import './index.css';
import '../MarketPlace/index.css';
import '../MyAccount/index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import { fetchCollections, fetchCollectionsTable, setGridOption } from '../../actions/marketplace';
import { DEFAULT_LAZY_FETCH_HEIGHT, DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config';
import NoData from '../../components/NoData';
import { IconButton } from '@mui/material';
import { ReactComponent as GridButton } from '../../assets/explore/grid.svg';
import SearchTextField from './SearchTextField';
import { hideActiveCard } from '../../actions/explore';
import SkeletonLoader from '../../components/SkeletonLoader';
import List from './List';
import Table from './Table';

class Collections extends React.Component {
    constructor (props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleOptions = this.handleOptions.bind(this);
    }

    componentDidMount () {
        if (this.props.address && this.props.collections && !this.props.collections.length &&
            !this.props.collectionsInProgress) {
            this.props.fetchCollections(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
        } else if (this.props.collections && !this.props.collections.length && !this.props.collectionsInProgress) {
            this.props.fetchCollections(null, DEFAULT_SKIP, DEFAULT_LIMIT);
        }

        if (this.props.activeCardShow) {
            this.props.hideActiveCard();
        }

        document.body.style.overflow = 'hidden';
    }

    componentDidUpdate (pp, ps, ss) {
        if (pp.keys && pp.keys.bech32Address && this.props.keys && this.props.keys.bech32Address &&
            (pp.keys.bech32Address !== this.props.keys.bech32Address)) {
            this.props.fetchCollections(this.props.keys.bech32Address, DEFAULT_SKIP, DEFAULT_LIMIT);
            this.props.fetchCollectionsTable(this.props.keys.bech32Address, DEFAULT_SKIP, DEFAULT_LIMIT - 10, 'created_at', 'desc');
        }
        if ((pp.address !== this.props.address) && this.props.address) {
            this.props.fetchCollections(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT);
        }
    }

    handleScroll (e) {
        const scroll = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const height = e.target.clientHeight;

        if ((this.props.collections.length < this.props.collectionsTotal) &&
            ((scrollHeight - scroll) <= (height + DEFAULT_LAZY_FETCH_HEIGHT)) &&
            !this.props.collectionsInProgress) {
            if (this.props.address) {
                this.props.fetchCollections(this.props.address, this.props.collectionsSkip + DEFAULT_LIMIT, this.props.collectionsLimit, this.props.searchKey);
            } else {
                this.props.fetchCollections(null, this.props.collectionsSkip + DEFAULT_LIMIT, this.props.collectionsLimit, this.props.searchKey);
            }
        }
    }

    handleOptions (value) {
        if (this.props.collectionsTable && !this.props.collectionsTable.length && !this.props.collectionsTableInProgress) {
            this.props.fetchCollectionsTable(this.props.address, DEFAULT_SKIP, DEFAULT_LIMIT - 10, 'created_at', 'desc');
        }

        this.props.setGridOption(!this.props[value]);
    }

    render () {
        return (
            <div className="explore_main collections_main">
                <div className="explore scroll_bar" onScroll={this.handleScroll}>
                    <div className="explore_header">
                        <div className="explore_head_left">
                            {this.props.collections && (this.props.collections.length === 0) && this.props.collectionsInProgress
                                ? null
                                : this.props.collections && this.props.collections.length
                                    ? <>
                                        {variables[this.props.lang].results}{' : '}
                                        {this.props.collections && this.props.collections.length > 0 &&
                                        this.props.collectionsTotal ? this.props.collectionsTotal : 0}
                                    </>
                                    : <>
                                        {variables[this.props.lang].results}{' : '}
                                        {this.props.collections && this.props.collections.length > 0 &&
                                        this.props.collectionsTotal ? this.props.collectionsTotal : 0}
                                    </>}
                            {this.props.gridOption &&
                                <div className="listing_search">
                                    <SearchTextField/>
                                </div>}
                        </div>
                        <div className="explore_head_right">
                            <IconButton
                                className={this.props.gridOption ? 'active_button' : 'default_button'}
                                onClick={() => this.handleOptions('gridOption')}>
                                <GridButton/>
                            </IconButton>
                        </div>
                    </div>
                    {this.props.gridOption
                        ? <div className="lists collection_list">
                            {this.props.collections && (this.props.collections.length === 0) &&
                            (this.props.collectionsInProgress || this.props.addressInProgress)
                                ? <SkeletonLoader type="collection-card"/>
                                : this.props.collections && this.props.collections.length
                                    ? <List/>
                                    : <NoData/>}
                            {(this.props.collections && this.props.collections.length) && this.props.collectionsInProgress
                                ? <SkeletonLoader type="collection-card"/> : null}
                        </div>
                        : <div className="collection_table">
                            <Table/>
                        </div>}
                </div>
            </div>
        );
    }
}

Collections.propTypes = {
    activeCardShow: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired,
    addressInProgress: PropTypes.bool.isRequired,
    collections: PropTypes.array.isRequired,
    collectionsInProgress: PropTypes.bool.isRequired,
    collectionsLimit: PropTypes.number.isRequired,
    collectionsSkip: PropTypes.number.isRequired,
    collectionsTable: PropTypes.array.isRequired,
    collectionsTableInProgress: PropTypes.bool.isRequired,
    collectionsTotal: PropTypes.number.isRequired,
    fetchCollections: PropTypes.func.isRequired,
    fetchCollectionsTable: PropTypes.func.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    keys: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    searchKey: PropTypes.string.isRequired,
    child: PropTypes.bool,
    gridOption: PropTypes.bool,
    setGridOption: PropTypes.func,
};

const stateToProps = (state) => {
    return {
        activeCardShow: state.explore.activeCard.open,
        address: state.account.wallet.connection.address,
        addressInProgress: state.account.wallet.connection.addressInProgress,
        lang: state.language,
        collections: state.marketplace.collections.result,
        collectionsInProgress: state.marketplace.collections.inProgress,
        collectionsTotal: state.marketplace.collections.total,
        collectionsSkip: state.marketplace.collections.skip,
        collectionsLimit: state.marketplace.collections.limit,
        collectionsTable: state.marketplace.tableCollections.result,
        collectionsTableInProgress: state.marketplace.tableCollections.inProgress,
        gridOption: state.marketplace.gridOption.value,
        searchKey: state.marketplace.collectionsSearch.value,
        keys: state.account.wallet.connection.keys,
    };
};

const actionToProps = {
    fetchCollections,
    fetchCollectionsTable,
    hideActiveCard,
    setGridOption,
};

export default connect(stateToProps, actionToProps)(Collections);
