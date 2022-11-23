import { ReactComponent as FlixLogo } from '../../assets/tokens/flix.svg';
import { ReactComponent as DVPNLogo } from '../../assets/tokens/dvpn.svg';
import { ReactComponent as ATOMLogo } from '../../assets/tokens/atom.svg';
import { ReactComponent as JUNOLogo } from '../../assets/tokens/juno.svg';
import { ReactComponent as SPAYLogo } from '../../assets/tokens/spay.svg';
import { ReactComponent as AKTLogo } from '../../assets/tokens/akash.svg';
import { ReactComponent as HUAHUALogo } from '../../assets/tokens/chihuahua.svg';
import { ReactComponent as CROLogo } from '../../assets/tokens/crypto.com.svg';
import { ReactComponent as GRAVITONLogo } from '../../assets/tokens/gravityBridge.svg';
import { ReactComponent as KILogo } from '../../assets/tokens/KI.svg';
import { ReactComponent as LIKELogo } from '../../assets/tokens/like.svg';
import { ReactComponent as OSMOLogo } from '../../assets/tokens/osmosis.svg';
import { ReactComponent as ROWANLogo } from '../../assets/tokens/sifchain.svg';
import starsToken from '../../assets/tokens/stargaze.png';
import { ReactComponent as LUNALogo } from '../../assets/tokens/terra.svg';
import * as PropTypes from 'prop-types';
import React from 'react';

const NetworkSvgImages = (props) => {
    switch (props.name) {
    case 'AKT':
        return <AKTLogo/>;
    case 'ATOM':
    case 'ATOM/CH-0':
        return <ATOMLogo/>;
    case 'BLUE':
    case 'BLUE/CH-3':
        return <DVPNLogo/>;
    case 'CRO':
        return <CROLogo/>;
    case 'FLIX':
        return <FlixLogo/>;
    case 'GRAVITON':
        return <GRAVITONLogo/>;
    case 'HUAHUA':
        return <HUAHUALogo/>;
    case 'JUNO':
    case 'JUNOX':
        return <JUNOLogo/>;
    case 'LIKE':
        return <LIKELogo/>;
    case 'OSMO':
        return <OSMOLogo/>;
    case 'ROWAN':
        return <ROWANLogo/>;
    case 'SPAY':
        return <SPAYLogo/>;
    case 'STARS':
        return <img alt="STARS" src={starsToken}/>;
    case 'LUNA':
    case 'USD':
        return <LUNALogo/>;
    case 'XKI':
        return <KILogo/>;
    default:
        break;
    }
};

NetworkSvgImages.propTypes = {
    name: PropTypes.string,
};

export default NetworkSvgImages;
