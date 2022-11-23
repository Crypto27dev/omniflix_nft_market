import React from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../components/Icon';
import * as PropTypes from 'prop-types';

const ForwardButton = (props) => {
    const handleForward = () => {
        props.player.currentTime(props.player.currentTime() + 5);
    };

    return (
        <IconButton className="skip_buttons forward_button" onClick={handleForward}>
            <Icon className="forward" icon="forward"/>
        </IconButton>
    );
};

ForwardButton.propTypes = {
    player: PropTypes.object,
};

export default ForwardButton;
