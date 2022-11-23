import React from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../components/Icon';
import * as PropTypes from 'prop-types';

const PlayButton = (props) => {
    const handlePlayToggle = () => {
        props.player.play();
    };

    const handlePauseToggle = () => {
        props.player.pause();
    };

    return (
        <>
            <IconButton className="play_button" onClick={handlePlayToggle}>
                <Icon className="play" icon="play"/>
            </IconButton>
            <IconButton className="pause_button" onClick={handlePauseToggle}>
                <Icon className="pause" icon="pause"/>
            </IconButton>
        </>
    );
};

PlayButton.propTypes = {
    player: PropTypes.object,
};

export default PlayButton;
