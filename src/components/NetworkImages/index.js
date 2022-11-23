import React from 'react';
import * as PropTypes from 'prop-types';
import flixToken from '../../assets/tokens/flix.svg';
import atomToken from '../../assets/tokens/atom.svg';
import dvpnToken from '../../assets/tokens/dvpn.svg';
import spayToken from '../../assets/tokens/spay.svg';
import junoToken from '../../assets/tokens/juno.svg';
import aktToken from '../../assets/tokens/akash.svg';
import huahuaToken from '../../assets/tokens/chihuahua.svg';
import croToken from '../../assets/tokens/crypto.com.svg';
import gravitonToken from '../../assets/tokens/gravityBridge.svg';
import kiToken from '../../assets/tokens/KI.svg';
import likeToken from '../../assets/tokens/like.svg';
import osmoToken from '../../assets/tokens/osmosis.svg';
import rowanToken from '../../assets/tokens/sifchain.svg';
import starsToken from '../../assets/tokens/stargaze.png';
import lunaToken from '../../assets/tokens/terra.svg';

const NetworkImages = (props) => {
    let imageIcon = null;
    switch (props.name) {
    case 'AKT':
        imageIcon = aktToken;
        break;
    case 'ATOM':
    case 'ATOM/CH-0':
        imageIcon = atomToken;
        break;
    case 'BLUE':
    case 'BLUE/CH-3':
        imageIcon = dvpnToken;
        break;
    case 'CRO':
        imageIcon = croToken;
        break;
    case 'FLIX':
        imageIcon = flixToken;
        break;
    case 'GRAVITON':
        imageIcon = gravitonToken;
        break;
    case 'HUAHUA':
        imageIcon = huahuaToken;
        break;
    case 'JUNO':
    case 'JUNOX':
        imageIcon = junoToken;
        break;
    case 'LIKE':
        imageIcon = likeToken;
        break;
    case 'OSMO':
        imageIcon = osmoToken;
        break;
    case 'ROWAN':
        imageIcon = rowanToken;
        break;
    case 'SPAY':
        imageIcon = spayToken;
        break;
    case 'STARS':
        imageIcon = starsToken;
        break;
    case 'LUNA':
    case 'USD':
        imageIcon = lunaToken;
        break;
    case 'XKI':
        imageIcon = kiToken;
        break;
    default:
        break;
    }

    return props.name !== '' && imageIcon && <img alt={props.alt ? props.alt : 'icon'} src={imageIcon}/>;
};

NetworkImages.propTypes = {
    alt: PropTypes.string,
    name: PropTypes.string,
};

export default NetworkImages;
