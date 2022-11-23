import React from 'react';
import Switch from '@material-ui/core/Switch';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { setWhiteListSwitch } from '../../../../../../actions/marketplace';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#FAC01E',
            '& + .MuiSwitch-track': {
                background: 'linear-gradient(91.79deg, #FAC01E 3.15%, #FC762A 85.66%)',
            },
        },
    },
    switchBase: {
        color: '#696969',
    },
    track: {
        background: '#555555',
    },
}));

const WhiteListSwitch = (props) => {
    const handleChange = (event) => {
        props.onChange(event.target.checked);
    };

    return (
        <Switch
            checked={props.value}
            className="switch"
            classes={{
                root: useStyles().root,
                switchBase: useStyles().switchBase,
                track: useStyles().track,
            }}
            name="splitStatus"
            onChange={handleChange}/>
    );
};

WhiteListSwitch.propTypes = {
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        value: state.marketplace.whiteListSwitch,
    };
};

const actionsToProps = {
    onChange: setWhiteListSwitch,
};

export default connect(stateToProps, actionsToProps)(WhiteListSwitch);
