import React from 'react';
import * as PropTypes from 'prop-types';
import ClassNames from 'classnames';
import thumbnail from '../../assets/thumbnail.svg';

const VideoOnLoad = (props) => {
    const [poster, setPoster] = React.useState(null);

    React.useEffect(() => {
        setPoster(null);
        if (props.preview) {
            const image = new Image();
            image.onload = () => {
                setPoster(props.preview);
            };
            image.src = props.preview;
        }
    }, [props.preview]);

    if (poster) {
        return (
            <video
                loop muted playsInline className={ClassNames('inline_video', props.className)}
                id="video-background"
                poster={props.preview}>
                <source src={props.src} type={props.type}/>
            </video>
        );
    }

    return (
        <video
            loop muted playsInline className={ClassNames('inline_video', props.className)}
            id="video-background"
            poster={thumbnail}>
            <source src={props.src} type={props.type}/>
        </video>
    );
};

VideoOnLoad.propTypes = {
    className: PropTypes.string,
    preview: PropTypes.string,
    src: PropTypes.string,
    type: PropTypes.string,
};

export default VideoOnLoad;
