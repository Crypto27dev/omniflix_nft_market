import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Icon from '../../../components/Icon';
import * as PropTypes from 'prop-types';

class VolumeButton extends Component {
    constructor (props) {
        super(props);

        this.state = {
            mute: !!localStorage.getItem('of_nucleus_muted'),
        };

        this.handleVolumeMute = this.handleVolumeMute.bind(this);
        this.handleVolumeUnMute = this.handleVolumeUnMute.bind(this);
    }

    handleVolumeUnMute () {
        this.props.player.muted(false);
        this.setState({
            mute: false,
        });
        localStorage.removeItem('of_nucleus_muted');
    }

    handleVolumeMute () {
        this.props.player.muted(true);
        this.setState({
            mute: true,
        });
        localStorage.setItem('of_nucleus_muted', 'true');
    }

    render () {
        return (
            <>
                {this.state.mute
                    ? <Button
                        className="volume_button muted"
                        onClick={this.handleVolumeUnMute}>
                        <Icon className="mute" icon="mute"/>
                    </Button>
                    : <Button
                        className="volume_button un_muted"
                        onClick={this.handleVolumeMute}>
                        <Icon className="volume" icon="volume"/>
                    </Button>}
            </>
        );
    }
}

VolumeButton.propTypes = {
    player: PropTypes.object,
};

export default VolumeButton;
