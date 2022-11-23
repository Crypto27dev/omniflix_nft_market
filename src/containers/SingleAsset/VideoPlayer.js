import React from 'react';
import VideoJS from 'video.js';
import Player from '../../components/Player';
import 'video.js/dist/video-js.css';
import { setPlayer } from '../../actions/marketplace';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import Controls from './Controls';

const videoJSOptions = {
    autoplay: true,
    controls: true,
    loop: true,
    width: 500,
    height: 600,
    controlBar: {
        children: [
            'currentTimeDisplay',
            'timeDivider',
            'progressControl',
            'FullscreenToggle',
        ],
    },
    userActions: {
        doubleClick: false,
    },
};

class Preview extends React.Component {
    constructor (props) {
        super(props);
        this.initializePlayer = this.initializePlayer.bind(this);
    }

    async componentDidUpdate (pp, ps, ss) {
        if (pp.url !== this.props.url) {
            if (this.props.type && this.props.url) {
                this.player && this.player.src({
                    type: this.props.type,
                    src: this.props.url,
                });
            } else {
                this.player && this.player.src({
                    type: 'video/mp4',
                    src: this.props.url,
                });
            }
            this.player && this.player.autoplay();
            this.player && this.player.muted(!!localStorage.getItem('of_nucleus_muted'));
        }

        if (pp.poster !== this.props.poster) {
            this.player.poster(this.props.poster);
        }
    }

    initializePlayer (ref) {
        this.player = VideoJS(ref, videoJSOptions);
        if (this.player) {
            this.props.setPlayer(this.player);
            this.player && this.player.muted(!!localStorage.getItem('of_nucleus_muted'));
            this.player.src({
                type: 'video/mp4',
                src: this.props.url,
            });
            if (this.props.poster) {
                this.player.poster(this.props.poster);
            }
        }
    }

    componentWillUnmount () {
        if (this.player) {
            this.player.dispose();
        }
    }

    render () {
        return (
            <div className="player">
                <Player initializePlayer={this.initializePlayer}>
                    <Controls/>
                </Player>
            </div>
        );
    }
}

Preview.propTypes = {
    setPlayer: PropTypes.func.isRequired,
    poster: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
};

const actionToProps = {
    setPlayer: setPlayer,
};

export default connect(null, actionToProps)(Preview);
