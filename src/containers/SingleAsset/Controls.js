import React from 'react';
import './index.css';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import BackButton from '../../components/Player/Controls/BackButton';
import PlayButton from '../../components/Player/Controls/PlayButton';
import ForwardButton from '../../components/Player/Controls/ForwardButton';
import VolumeButton from '../../components/Player/Controls/VolumeButton';

const Controls = (props) => {
    return (
        <div className="player_controls">
            <BackButton player={props.player}/>
            <PlayButton player={props.player}/>
            <ForwardButton player={props.player}/>
            <VolumeButton player={props.player}/>
        </div>
    );
};

Controls.propTypes = {
    player: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        player: state.marketplace.player,
    };
};

export default connect(stateToProps)(Controls);
