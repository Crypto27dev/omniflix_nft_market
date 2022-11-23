import React from 'react';
import './index.css';
import variables from '../../../utils/variables';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReactComponent as BackIcon } from '../../../assets/explore/Vector.svg';
import { IconButton } from '@mui/material';
// import Status from './Status';
import PriceRange from './PriceRange';
import { hideFilters } from '../../../actions/filters';
import ClassNames from 'classnames';
// import Genre from './Genre';
// import SingleCollection from './SingleCollection';
// import Chains from './Chains';
import OnSaleIn from './OnSaleIn';
// import Types from './Types';
import DotsLoading from '../../../components/DotsLoading';
import SearchTextField from '../SearchTextField';

class Filters extends React.Component {
    render () {
        return (
            <div className={ClassNames('filters scroll_bar', this.props.filterShow ? 'show' : '')}>
                <div className="heading">
                    <p>{variables[this.props.lang].filters}</p>
                    <IconButton onClick={this.props.hideFilters}>
                        <BackIcon/>
                    </IconButton>
                </div>
                <SearchTextField/>
                {/* <Status/> */}
                <PriceRange/>
                {/* <Genre/> */}
                {/* <SingleCollection/> */}
                {/* <Chains/> */}
                {this.props.ibcTokensListInProgress
                    ? <DotsLoading/>
                    : <OnSaleIn/>}
                {/* <Types/> */}
            </div>
        );
    }
}

Filters.propTypes = {
    filterShow: PropTypes.bool.isRequired,
    hideFilters: PropTypes.func.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        filterShow: state.filters.show,
        lang: state.language,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

const actionToProps = {
    hideFilters,
};

export default connect(stateToProps, actionToProps)(Filters);
