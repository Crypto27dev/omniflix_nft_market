import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import arrowIcon from '../../../assets/explore/transferability.svg';
import Icon from '../../../components/Icon';
import PurchaseCard from '../../MarketPlace/ActiveCard/PurchaseCard';
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreInfo from '../../MarketPlace/ActiveCard/MoreInfo';
import { withRouter } from 'react-router';
import Breadcrumb from '../Breadcrumb';
import { hideActiveCard } from '../../../actions/explore';
import { setEmptySingleAsset, showMenuPopover, showSchemaJsonDialog } from '../../../actions/marketplace';
import variables from '../../../utils/variables';
import JsonSchemaDialog from '../../SingleCollection/JsonSchemaDialog';
import DeList from '../../MarketPlace/ActiveCard/DeList';
import TransferSell from '../../MarketPlace/ActiveCard/TransferSell';
import { getAssetType } from '../../../utils/strings';
import genesisCreatorIcon from '../../../assets/diamond.svg';
import { ReactComponent as CopyRight } from '../../../assets/copy-right.svg';
import PlaceBid from '../../MarketPlace/ActiveCard/PlaceBid';
import moreIcon from '../../../assets/explore/more.svg';

const Card = (props) => {
    const denomID = props.nftDetails && props.nftDetails.denom_id &&
        props.nftDetails.denom_id.id;

    const handleClick = (value) => {
        if (value === 'collection') {
            props.history.push('/collection/' + denomID);
        } else if (value === 'close') {
            props.history.goBack();
            props.hideActiveCard();
        } else {
            props.history.goBack();
            props.hideActiveCard();
        }

        props.setEmptySingleAsset();
    };

    const value = {
        nftDetails: props.nftDetails,
    };

    const owner = props.nftDetails && props.nftDetails.auction
        ? props.nftDetails.auction.owner && (props.nftDetails.auction.owner === props.address)
        : props.nftDetails && props.nftDetails.list &&
        props.nftDetails.list.owner && (props.nftDetails.list.owner === props.address);

    let data = {};
    if (props.nftDetails && props.nftDetails.data) {
        try {
            data = JSON.parse(props.nftDetails.data);
        } catch (e) {
            data = {};
        }
    }

    let schema = {};
    if (data && data.schema) {
        schema = data.schema;
    } else if (data && Object.keys(data).length) {
        Object.keys(data).filter((key) => {
            schema[key] = data[key];

            return null;
        });
    }
    const handleJsonSchema = () => {
        props.showSchemaJsonDialog(schema);
    };

    const mediaType = props.nftDetails && props.nftDetails.media_type;

    return (
        <div className="single_asset_details scroll_bar">
            <div className="active_card_single_asset">
                <div>
                    <Breadcrumb/>
                </div>
                <div className="list_section1">
                    <div className="list_section1_left">
                        {mediaType &&
                            <div className="asset_type">
                                {mediaType && getAssetType(mediaType)}
                            </div>}
                        {/* <span>Artwork</span> */}
                        {/* <div><img alt="icon" src={lockIcon}/></div> */}
                        {/* <div><img alt="icon" src={settingIcon}/></div> */}
                        {props.nftDetails && props.nftDetails.transferable &&
                            <Tooltip title={variables[props.lang].transferability}>
                                <div>
                                    <img
                                        alt="icon"
                                        src={arrowIcon}
                                        style={{ height: '16px' }}/>
                                </div>
                            </Tooltip>}
                    </div>
                    <div className="list_section1_right">
                        {/* <div><img alt="icon" src={shareIcon}/></div> */}
                        {/* <div><img alt="icon" src={linkIcon}/></div> */}
                        <div onClick={() => handleClick('collection')}>
                            <Icon className="gridicons_fullscreen" icon="gridicons_fullscreen"/>
                        </div>
                        {(props.nftDetails && props.nftDetails.list) ||
                        (props.nftDetails && props.nftDetails.auction)
                            ? null
                            : props.nftDetails && props.nftDetails.owner &&
                            (props.nftDetails.owner === props.address) &&
                            <Tooltip title={variables[props.lang]['more_options']}>
                                <div onClick={(e) => props.showMenuPopover(e, props.nftDetails)}>
                                    <img alt="icon" src={moreIcon}/>
                                </div>
                            </Tooltip>}
                        <Tooltip title={variables[props.lang].close}>
                            <div onClick={() => handleClick('close')}>
                                <Icon className="close" icon="close"/>
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className="row">
                    <div className="list_section3_div">
                        <Tooltip
                            title={(props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.name) + ' | ' +
                                (props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.symbol)}>
                            <a
                                href={'/collection/' + denomID}
                                rel="no-refresh"
                                onClick={() => props.setEmptySingleAsset()}>
                                {props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.name}
                            </a>
                        </Tooltip>
                        {props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.IP_infringement
                            ? <Tooltip title={variables[props.lang]['ip_tooltip']}>
                                <CopyRight/>
                            </Tooltip>
                            : props.nftDetails && props.nftDetails.denom_id && props.nftDetails.denom_id.verified
                                ? <Tooltip title={variables[props.lang]['genesis_creator']}>
                                    <img alt="genesis_creator" src={genesisCreatorIcon}/>
                                </Tooltip>
                                : null}
                        {/* <img alt="success" src={successIcon}/> */}
                    </div>
                </div>
                <div className="active_card_section4">
                    <div className="section4_row1">
                        <Tooltip title={props.nftDetails && props.nftDetails.name}>
                            <span>{props.nftDetails && props.nftDetails.name}</span>
                        </Tooltip>
                        <div className="section4_row1_nft">
                            <span>NFT ID:</span>
                            {props.nftDetails && props.nftDetails.id &&
                                <div className="hash_text" title={props.nftDetails.id}>
                                    <p className="name">{props.nftDetails.id}</p>
                                    {props.nftDetails.id.slice(props.nftDetails.id.length - 4, props.nftDetails.id.length)}
                                </div>}
                        </div>
                    </div>
                    <div className="section4_row2">
                        {props.nftDetails &&
                            props.nftDetails.description}
                    </div>
                </div>
                {schema && Object.keys(schema).length
                    ? <div className="section6_chips">
                        <div className="header_section">
                            <span>{variables[props.lang].properties}</span>
                            <span onClick={() => handleJsonSchema()}> {variables[props.lang]['view_json_file']}</span>
                        </div>
                        <div className="properties">
                            {Object.keys(schema).map((key) => {
                                if (typeof schema[key] !== 'string') {
                                    return null;
                                }

                                return (
                                    <div key={key}>
                                        <span>{key.replace(/_/g, ' ')}</span>
                                        <p>{schema[key]}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div> : null}
                {props.nftDetails && props.nftDetails.denom_id &&
                props.nftDetails.denom_id.description && props.nftDetails.denom_id.description.length
                    ? <div className="about_collection">
                        <Accordion className="expansion_panel">
                            <AccordionSummary
                                className="expansion_summary"
                                expandIcon={<ExpandMoreIcon/>}>
                                <div className="expansion_header">About Collection</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="expand_details">
                                    <span>
                                        {props.nftDetails && props.nftDetails.denom_id &&
                                            props.nftDetails.denom_id.description}
                                    </span>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div> : null}
                <MoreInfo value={value}/>
                <JsonSchemaDialog/>
            </div>
            {props.nftDetails && props.nftDetails.status && (props.nftDetails.status === 'BURNED')
                ? null
                : (props.nftDetails && props.nftDetails.auction &&
                    !props.nftDetails.auction.last_bid && owner) ||
                (props.nftDetails && props.nftDetails.list && props.nftDetails.list.price &&
                    props.nftDetails.list.price.amount && owner)
                    ? <DeList nftDetails={value}/>
                    : props.nftDetails && props.nftDetails.auction
                        ? <PlaceBid singleNft owner={owner} value={value}/>
                        : props.nftDetails && props.nftDetails.list &&
                        props.nftDetails.list.price && props.nftDetails.list.price.amount && !owner
                            ? <PurchaseCard value={value}/>
                            : (props.nftDetails && props.nftDetails.transferable) &&
                            (props.nftDetails && props.nftDetails.owner === props.address)
                                ? <TransferSell nftDetails={value}/>
                                : null}
        </div>
    );
};

Card.propTypes = {
    address: PropTypes.string.isRequired,
    hideActiveCard: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    lang: PropTypes.string.isRequired,
    nftDetails: PropTypes.object.isRequired,
    setEmptySingleAsset: PropTypes.func.isRequired,
    showMenuPopover: PropTypes.func.isRequired,
    showSchemaJsonDialog: PropTypes.func.isRequired,
    collection: PropTypes.object,
    match: PropTypes.shape({
        params: PropTypes.shape({
            listID: PropTypes.string,
            denomID: PropTypes.string,
            nftID: PropTypes.string,
        }),
    }),
    nft: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        nftDetails: state.marketplace.nftDetails.result,
    };
};

const actionToProps = {
    hideActiveCard,
    setEmptySingleAsset,
    showSchemaJsonDialog,
    showMenuPopover,
};

export default withRouter(connect(stateToProps, actionToProps)(Card));
