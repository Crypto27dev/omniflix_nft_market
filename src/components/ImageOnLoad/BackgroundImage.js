import React from 'react';
import * as PropTypes from 'prop-types';
import thumbnail from '../../assets/thumbnail.svg';
import ClassNames from 'classnames';
import './index.css';

const ImageOnLoad = (props) => {
    const [loadedSrc, setLoadedSrc] = React.useState(null);
    const [loadedPreview, setLoadedPreview] = React.useState(null);
    const [cdn, setCdn] = React.useState(null);

    React.useEffect(() => {
        setCdn(null);
        let medium = null;
        let standard = null;
        if (props.cdn && props.cdn.length) {
            props.cdn && props.cdn.map((val) => {
                if (val.indexOf('/medium') > -1) {
                    medium = val;
                } else if (val.indexOf('/standard') > -1) {
                    standard = val;
                }

                return null;
            });
        } else {
            return;
        }

        if (medium) {
            const image = new Image();
            image.onload = () => {
                setCdn(medium);
            };
            image.src = medium;
        } else if (standard) {
            const image = new Image();
            image.onload = () => {
                setCdn(standard);
            };
            image.src = standard;
        }
    }, [props.cdn]);

    React.useEffect(() => {
        setLoadedPreview(null);
        if (props.cdn && props.cdn.length) {
            return;
        }
        if (props.preview) {
            const image = new Image();
            image.onload = () => {
                setLoadedPreview(props.preview);
            };
            image.src = props.preview;
        }
    }, [props.preview, props.cdn]);

    React.useEffect(() => {
        setLoadedSrc(null);
        if (props.cdn && props.cdn.length) {
            return;
        }
        if (props.src) {
            const image = new Image();
            image.onload = () => {
                setLoadedSrc(props.src);
            };
            image.src = props.src;
        }
    }, [props.src, props.cdn]);

    const handleOnClick = () => {
        if (props.onClick) {
            props.onClick();
        }
    };

    if (cdn) {
        return (
            <div className={props.className} style={{ backgroundImage: `url(${cdn})` }} onClick={handleOnClick}/>
        );
    } else if (loadedSrc) {
        return (
            <div className={props.className} style={{ backgroundImage: `url(${props.src})` }} onClick={handleOnClick}/>
        );
    } else if (loadedPreview) {
        return (
            <div
                className={props.className} style={{ backgroundImage: `url(${props.preview})` }}
                onClick={handleOnClick}/>
        );
    }

    return <div
        className={ClassNames(props.className, 'dummy_image')}
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={handleOnClick}/>;
};

ImageOnLoad.propTypes = {
    className: PropTypes.string.isRequired,
    cdn: PropTypes.array,
    preview: PropTypes.string,
    src: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
};

export default ImageOnLoad;
