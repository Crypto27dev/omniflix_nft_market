import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import variables from '../../../../../../utils/variables';
import SelectField from '../../../../../../components/SelectField/TokenSelectField';
import { fetchIBCTokensList, setSellTokenValue } from '../../../../../../actions/marketplace';
import { tokensList } from '../../../../../../utils/defaultOptions';
import { images } from '../../../../../../components/NetworkImages/ImagesOptions';

class SelectTokenSelectField extends Component {
    componentDidMount () {
        if (this.props.ibcTokensList.length === 0 && !this.props.ibcTokensListInProgress) {
            this.props.fetchIBCTokensList();
        }
    }

    render () {
        const list = this.props.ibcTokensList && this.props.ibcTokensList.length &&
            this.props.ibcTokensList.filter((val) => val.status === 'ENABLED' &&
                (val.network && val.network.display_denom !== 'ATOM/CH-0'));

        const options = [...tokensList];
        if (list && list.length) {
            options.push(...list);
        }

        return (
            <SelectField
                id="token"
                images={images}
                name="token"
                options={options}
                placeholder={variables[this.props.lang]['select_token']}
                value={this.props.value}
                onChange={this.props.onChange}/>
        );
    }
}

SelectTokenSelectField.propTypes = {
    fetchIBCTokensList: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        value: state.marketplace.sellTokenValue.value,
    };
};

const actionsToProps = {
    fetchIBCTokensList: fetchIBCTokensList,
    onChange: setSellTokenValue,
};

export default connect(stateToProps, actionsToProps)(SelectTokenSelectField);
