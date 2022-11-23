import React, { Component } from 'react';
import AutoCompleteTextField from '../../../../../../components/AutoCompleteTextField';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../../../../utils/variables';
import { setWhiteListValue } from '../../../../../../actions/marketplace';

class WhiteListTags extends Component {
    constructor (props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleTags = this.handleTags.bind(this);
    }

    handleChange (value) {
        const tags = value.split(/,/);
        if (tags.length > 1) {
            let array = [...this.props.value, ...tags];
            array = array.filter((item) => item !== '');
            array = array.filter((item, pos) => array.indexOf(item) === pos);

            this.props.onChange(array);
        }
    }

    handleTags (value) {
        this.props.onChange(value);
    }

    render () {
        return (
            <AutoCompleteTextField
                disableClearable
                freeSolo
                className="tags_select_field"
                handleInput={this.handleChange}
                id="tags"
                options={[]}
                placeholder={variables[this.props.lang]['add_tags']}
                value={this.props.value} onChange={this.handleTags}/>
        );
    }
}

WhiteListTags.propTypes = {
    lang: PropTypes.string.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        value: state.marketplace.whiteListValue,
    };
};

const actionsToProps = {
    onChange: setWhiteListValue,
};

export default connect(stateToProps, actionsToProps)(WhiteListTags);
