import React from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../components/Icon';
import * as PropTypes from 'prop-types';

const BackButton = (props) => {
    const handleBack = () => {
        props.player.currentTime(props.player.currentTime() - 5);
    };

    return (
        <IconButton className="skip_buttons back_button" onClick={handleBack}>
            <Icon className="back" icon="back"/>
        </IconButton>
    );
};

BackButton.propTypes = {
    player: PropTypes.object,
};

export default BackButton;
