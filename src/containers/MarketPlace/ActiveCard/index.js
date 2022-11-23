import React from 'react';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClassNames from 'classnames';
import arrowIcon from '../../../assets/explore/transferability.svg';
import Icon from '../../../components/Icon';
import { hideActiveCard } from '../../../actions/explore';
import PurchaseCard from './PurchaseCard';
import { Accordion, AccordionDetails, AccordionSummary, Button, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreInfo from './MoreInfo';
import { withRouter } from 'react-router';
import { IPFS_URL } from '../../../config';
import TransferSell from './TransferSell';
import DeList from './DeList';
import variables from '../../../utils/variables';
import { showMenuPopover, showSchemaJsonDialog } from '../../../actions/marketplace';
import JsonSchemaDialog from '../../SingleCollection/JsonSchemaDialog';
import downloadIcon from '../../../assets/download.svg';
import { saveAs } from 'file-saver';
import { getAssetType, getAssetTypeExtension } from '../../../utils/strings';
import ImageOnLoad from '../../../components/ImageOnLoad';
import VideoPlayer from '../../SingleAsset/VideoPlayer';
import '../../SingleAsset/Card/index.css';
import PlaceBid from './PlaceBid';
import moreIcon from '../../../assets/explore/more.svg';

const ActiveCard = (props) => {
    const onClick = () => {
        const nftID = props.value && props.value.nftDetails && props.value.nftDetails.id;
        if (nftID) {
            props.history.push('/nft/' + nftID);
        }
    };

    const handleCollection = () => {
        if (!props.match.params.id) {
            const id = props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
                props.value.nftDetails.denom_id.id && (props.value.nftDetails.denom_id.id);
            props.history.push('/collection/' + id);
            props.hide();
        }
    };

    const handleNFT = (nft, event) => {
        event.stopPropagation();
        props.history.push('/nft/' + nft);
    };

    const saveFile = (value, nft) => {
        saveAs(value, nft && nft.name + '.pdf');
    };

    const owner = props.value && props.value.nftDetails && props.value.nftDetails.auction
        ? props.value.nftDetails.auction.owner && (props.value.nftDetails.auction.owner === props.address)
        : props.value && props.value.nftDetails && props.value.nftDetails.list &&
        props.value.nftDetails.list.owner && (props.value.nftDetails.list.owner === props.address);

    const url = props.value && props.value.nftDetails &&
    props.value.nftDetails.file &&
    props.value.nftDetails.file.IPFS_hash
        ? `${IPFS_URL}/${props.value.nftDetails.file.IPFS_hash}`
        : props.value && props.value.nftDetails &&
        props.value.nftDetails &&
        props.value.nftDetails.media_uri
            ? props.value.nftDetails.media_uri
            : null;

    const poster = props.value && props.value.nftDetails &&
    props.value.nftDetails.file &&
    props.value.nftDetails.file['preview_IPFS_hash']
        ? `${IPFS_URL}/${props.value.nftDetails.file['preview_IPFS_hash']}`
        : props.value && props.value.nftDetails &&
        props.value.nftDetails &&
        props.value.nftDetails.preview_uri
            ? props.value.nftDetails.preview_uri
            : null;

    let data = {};
    if (props.value && props.value.nftDetails &&
        props.value.nftDetails.data) {
        try {
            data = JSON.parse(props.value.nftDetails.data);
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

    const mediaType = props.value && props.value.nftDetails &&
        props.value.nftDetails && props.value.nftDetails.media_type;
    const collectionID = props.value && props.value.nftDetails && props.value.nftDetails.denom_id &&
        props.value.nftDetails.denom_id.id && (props.value.nftDetails.denom_id.id);
    const nftID = props.value && props.value.nftDetails && props.value.nftDetails.id;

    return (
        <div className={ClassNames('active_card scroll_bar', props.show ? 'show' : '')}>
            <div className="list_section1">
                <div className="list_section1_left">
                    {/* <span>Artwork</span> */}
                    {/* <div><img alt="icon" src={lockIcon}/></div> */}
                    {/* <div><img alt="icon" src={settingIcon}/></div> */}
                    {mediaType &&
                        <div className="asset_type">
                            {mediaType && getAssetType(mediaType)}
                        </div>}
                    {props.value && props.value.nftDetails &&
                        props.value.nftDetails.transferable &&
                        <Tooltip title={variables[props.lang].transferability}>
                            <div>
                                <img alt="icon" src={arrowIcon} style={{ height: '16px' }}/>
                            </div>
                        </Tooltip>}
                </div>
                <div className="list_section1_right">
                    {/* <div><img alt="icon" src={shareIcon}/></div> */}
                    {/* <div><img alt="icon" src={linkIcon}/></div> */}
                    <Tooltip title={variables[props.lang]['view_details']}>
                        <div onClick={() => onClick()}>
                            <Icon className="full_screen" icon="full_screen"/>
                        </div>
                    </Tooltip>
                    {(props.value && props.value.nftDetails && props.value.nftDetails.list) ||
                    (props.value && props.value.nftDetails && props.value.nftDetails.auction)
                        ? null
                        : props.value && props.value.nftDetails && props.value.nftDetails.owner &&
                        (props.value.nftDetails.owner === props.address) &&
                        <Tooltip title={variables[props.lang]['more_options']}>
                            <div onClick={(e) => props.showMenuPopover(e, props.value && props.value.nftDetails)}>
                                <img alt="icon" src={moreIcon}/>
                            </div>
                        </Tooltip>}
                    <Tooltip title={variables[props.lang].close}>
                        <div onClick={props.hide}>
                            <Icon className="close" icon="close"/>
                        </div>
                    </Tooltip>
                </div>
            </div>
            <div
                className={mediaType && getAssetType(mediaType) === 'document' ? 'pdf_section list_section2' : 'list_section2'}>
                {mediaType && getAssetType(mediaType) === 'document' && url
                    ? <iframe
                        className="pdf_view"
                        src={url}
                        title={props.value && props.value.nftDetails && props.value.nftDetails.name}/>
                    : mediaType &&
                    getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                        ? <div className="active_asset_image active_card_asset">
                            <ImageOnLoad alt="icon" preview={poster} src={url}/>
                        </div>
                        : mediaType && getAssetType(mediaType) === 'image'
                            ? <div className="active_asset_image active_card_asset">
                                <ImageOnLoad
                                    alt="icon"
                                    cdn={props.value && props.value.nftDetails &&
                                        props.value.nftDetails.cloudflare_cdn && props.value.nftDetails.cloudflare_cdn.variants}
                                    preview={poster} src={url}/>
                            </div>
                            : mediaType && (getAssetType(mediaType) === 'video' || getAssetType(mediaType) === 'audio')
                                ? <div className="video_content">
                                    <VideoPlayer poster={poster} type={mediaType} url={url}/>
                                </div>
                                : <ImageOnLoad
                                    alt="icon"
                                    cdn={props.value && props.value.nftDetails &&
                                        props.value.nftDetails.cloudflare_cdn && props.value.nftDetails.cloudflare_cdn.variants}
                                    preview={poster} src={url}/>}
                {mediaType && getAssetType(mediaType) === 'document' &&
                    <div className="pdf_download">
                        <Button onClick={() => saveFile(url, props.value && props.value.nftDetails)}>
                            <img alt="download" src={downloadIcon}/>
                            <p>{variables[props.lang]['download_file']}</p>
                        </Button>
                    </div>}
            </div>
            <div className="row">
                <div className="list_section3_div">
                    <Tooltip title={(props.value && props.value.nftDetails &&
                            props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.name) + ' | ' +
                        (props.value && props.value.nftDetails &&
                            props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.symbol)}>
                        {
                            !props.match.params.id
                                ? <a
                                    href={'/collection/' + collectionID}
                                    onClick={() => handleCollection()}>
                                    {props.value && props.value.nftDetails &&
                                        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.name}
                                </a>
                                : <span
                                    onClick={() => handleCollection()}>
                                    {props.value && props.value.nftDetails &&
                                        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.name}
                                </span>
                        }
                    </Tooltip>
                    {/* <img alt="success" src={successIcon}/> */}
                </div>
            </div>
            <div className="active_card_section4">
                <div className="section4_row1">
                    <Tooltip title={(props.value && props.value.nftDetails &&
                        props.value.nftDetails.name) || ''}>
                        <a
                            href={'/nft/' + nftID}
                            onClick={(event) => handleNFT(props.value && props.value.nftDetails && props.value.nftDetails.id, event)}>
                            {props.value && props.value.nftDetails &&
                                props.value.nftDetails.name}
                        </a>
                    </Tooltip>
                    <div className="section4_row1_nft">
                        <span>NFT ID:</span>
                        {props.value && props.value.nftDetails && props.value.nftDetails.id &&
                            <a
                                className="hash_text"
                                href={'/nft/' + nftID}
                                title={props.value.nftDetails.id}
                                onClick={(event) => handleNFT(props.value && props.value.nftDetails && props.value.nftDetails.id, event)}>
                                <p className="name">{props.value.nftDetails.id}</p>
                                {props.value.nftDetails.id.slice(props.value.nftDetails.id.length - 4, props.value.nftDetails.id.length)}
                            </a>}
                    </div>
                </div>
                <div className="section4_row2">
                    {props.value && props.value.nftDetails &&
                        props.value.nftDetails &&
                        props.value.nftDetails.description}
                </div>
            </div>
            {(props.value && props.value.nftDetails && props.value.nftDetails.list && props.value.nftDetails.list.price &&
                props.value.nftDetails.list.price.amount && !props.value.nftDetails.auction && owner) ||
            (props.value && props.value.nftDetails && props.value.nftDetails.auction &&
                (!props.value.nftDetails.auction.last_bid) && owner)
                ? <DeList nftDetails={props.value}/>
                : props.value && props.value.nftDetails && props.value.nftDetails.auction
                    ? <PlaceBid owner={owner} value={props.value}/>
                    : (props.value && props.value.nftDetails && props.value.nftDetails.list &&
                        props.value.nftDetails.list.price &&
                        props.value.nftDetails.list.price.amount && !owner)
                        ? <PurchaseCard value={props.value}/>
                        : (props.value && props.value.nftDetails && props.value.nftDetails.transferable) &&
                        (props.value.nftDetails && props.value.nftDetails.owner === props.address)
                            ? <TransferSell/>
                            : null}
            {schema && Object.keys(schema).length
                ? <div className="section6_chips">
                    <div className="header_section">
                        <span>{variables[props.lang].properties}</span>
                        <span onClick={() => handleJsonSchema()}>
                            {variables[props.lang]['view_json_file']}
                        </span>
                    </div>
                    <div className="properties">
                        {Object.keys(schema).map((key) => {
                            if (typeof schema[key] !== 'string') {
                                return null;
                            }

                            return (
                                <div key={key}>
                                    <span>{key.replace(/_/g, ' ')}</span>
                                    <p title={schema[key]}>{schema[key]}</p>
                                </div>
                            );
                        })}
                    </div>
                </div> : null}
            {props.value && props.value.nftDetails &&
            props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.description &&
            props.value.nftDetails.denom_id.description.length
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
                                    {props.value && props.value.nftDetails &&
                                        props.value.nftDetails.denom_id && props.value.nftDetails.denom_id.description}
                                </span>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div> : null}
            <MoreInfo value={props.value}/>
            <JsonSchemaDialog/>
        </div>
    );
};

ActiveCard.propTypes = {
    address: PropTypes.string.isRequired,
    hide: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    showMenuPopover: PropTypes.func.isRequired,
    showSchemaJsonDialog: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string,
        }).isRequired,
    }),
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
        lang: state.language,
        show: state.explore.activeCard.open,
        value: state.explore.activeCard.value,
    };
};

const actionToProps = {
    hide: hideActiveCard,
    showSchemaJsonDialog,
    showMenuPopover,
};

export default withRouter(connect(stateToProps, actionToProps)(ActiveCard));
