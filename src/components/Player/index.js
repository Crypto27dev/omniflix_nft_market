import * as PropTypes from 'prop-types';
import React from 'react';
import './index.css';

class Player extends React.Component {
    componentDidMount () {
        this.props.initializePlayer(this.node);
    }

    render () {
        return (
            <div>
                <video
                    ref={(node) => (this.node = node)}
                    className="video-js vjs-default-skin"
                    id="video-player"/>
                {this.props.children}
            </div>
        );
    }
}

Player.propTypes = {
    initializePlayer: PropTypes.func.isRequired,
    children: PropTypes.any,
};

export default Player;
