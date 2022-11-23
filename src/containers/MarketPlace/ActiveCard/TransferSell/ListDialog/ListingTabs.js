import { Tab, Tabs } from '@material-ui/core';
import variables from '../../../../../utils/variables';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ListingTabs extends React.Component {
    render () {
        return (
            <Tabs aria-label="listing tabs" className="tabs_content" value={this.props.tabValue}>
                <Tab
                    className={'tab ' + (this.props.tabValue === 'fixed-price' ? 'active_tab' : '')}
                    label={variables[this.props.lang]['fixed_price']}
                    value="fixed-price"
                    onClick={() => this.props.handleChange('fixed-price')}/>
                <Tab
                    className={'tab ' + (this.props.tabValue === 'timed-auction' ? 'active_tab' : '')}
                    // disabled={true}
                    label={<div className="">
                        <p>{variables[this.props.lang]['timed_auction']}</p>
                        {/* <span>({variables[this.props.lang]['coming_soon']})</span> */}
                    </div>}
                    value="timed-auction"
                    onClick={() => this.props.handleChange('timed-auction')}/>
            </Tabs>
        );
    }
}

ListingTabs.propTypes = {
    handleChange: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    tabValue: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
    };
};

export default connect(stateToProps)(ListingTabs);
