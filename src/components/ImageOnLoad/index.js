import React from 'react';
import * as PropTypes from 'prop-types';
import thumbnail from '../../assets/thumbnail.svg';
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
        if (props.cdn && props.cdn.length && !props.main) {
            return;
        }
        if (props.preview) {
            const image = new Image();
            image.onload = () => {
                setLoadedPreview(props.preview);
            };
            image.src = props.preview;
        }
    }, [props.preview, props.cdn, props.main]);

    React.useEffect(() => {
        setLoadedSrc(null);
        if (props.cdn && props.cdn.length && !props.main) {
            return;
        }
        if (props.src) {
            const image = new Image();
            image.onload = () => {
                setLoadedSrc(props.src);
            };
            image.src = props.src;
        }
    }, [props.src, props.cdn, props.main]);

    if (props.main) {
        if (loadedSrc) {
            const obj = {
                src: loadedSrc,
            };

            if (props.alt) {
                obj.alt = props.alt;
            }

            return (
                <img {...obj} alt="thumbnail"/>
            );
        } else if (loadedPreview) {
            const obj = {
                src: props.preview,
            };

            if (props.alt) {
                obj.alt = props.alt;
            }

            return (
                <img {...obj} alt="thumbnail"/>
            );
        } else if (cdn) {
            const obj = {
                src: cdn,
            };

            if (props.alt) {
                obj.alt = props.alt;
            }

            return (
                <img {...obj} alt="thumbnail"/>
            );
        }
    }

    if (cdn) {
        const obj = {
            src: cdn,
        };

        if (props.alt) {
            obj.alt = props.alt;
        }

        return (
            <img {...obj} alt="thumbnail"/>
        );
    } else if (loadedSrc) {
        const obj = {
            src: loadedSrc,
        };

        if (props.alt) {
            obj.alt = props.alt;
        }

        return (
            <img {...obj} alt="thumbnail"/>
        );
    } else if (loadedPreview) {
        const obj = {
            src: props.preview,
        };

        if (props.alt) {
            obj.alt = props.alt;
        }

        return (
            <img {...obj} alt="thumbnail"/>
        );
    }

    return <div className="default_thumbnail">
        <img alt="thumbnail" src={thumbnail}/>
        {props.text
            ? <p>{props.text}</p>
            : null}
    </div>;
};

ImageOnLoad.propTypes = {
    alt: PropTypes.string,
    cdn: PropTypes.array,
    className: PropTypes.string,
    main: PropTypes.bool,
    preview: PropTypes.string,
    src: PropTypes.string,
    text: PropTypes.string,
};

export default ImageOnLoad;
