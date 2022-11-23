import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordions from '../../../components/Accordions';
import variables from '../../../utils/variables';
import { setStatus } from '../../../actions/filters';

const Status = (props) => {
    const handleSelect = (value) => {
        const list = new Set(props.value);

        if (list.has(value)) {
            list.delete(value);
        } else {
            list.add(value);
        }

        props.onChange(list);
    };

    return (
        <Accordions className="selectable_chips status" name={variables[props.lang].status}>
            {props.list.map((val) => {
                return (
                    <span
                        key={val.value}
                        className={props.value.has(val.value) ? 'active' : ''}
                        onClick={() => handleSelect(val.value)}>
                        {val.name}
                    </span>
                );
            })}
        </Accordions>
    );
};

Status.propTypes = {
    lang: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        list: state.filters.status.list,
        value: state.filters.status.value,
    };
};

const actionToProps = {
    onChange: setStatus,
};

export default connect(stateToProps, actionToProps)(Status);
