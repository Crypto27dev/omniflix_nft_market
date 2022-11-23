import { Button, DialogContent } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from '../../../../../../utils/variables';
import './index.css';
import TotalSale from '../TotalSale';
import ImageOnLoad from '../../../../../../components/ImageOnLoad';
import { customTypes } from '../../../../../../registry';
import NetworkImages from '../../../../../../components/NetworkImages';
import { hideSellDialog } from '../../../../../../actions/marketplace';
import { getAssetType, getAssetTypeExtension } from '../../../../../../utils/strings';
import thumbnail from '../../../../../../assets/collections/thumbnail.svg';
import moment from 'moment';

const ConfirmListingDialog = (props) => {
    const price = props.tokenPrice;
    const name = props.tokenValue && props.tokenValue.network && props.tokenValue.network.display_denom
        ? props.tokenValue.network.display_denom : props.tokenValue.label;
    const collection = props.data && props.data.info && props.data.info.denom_id && props.data.info.denom_id.id &&
        props.data.info.denom_id;

    const totalSale = {
        tokenPrice: props.tokenPrice,
        tokenValue: props.tokenValue,
        details: props.details,
        splitInfo: props.splitInfo,
    };

    const mediaType = props.data && props.data.info.media_type;

    return (
        <DialogContent className="dialog_content confirm_listing scroll_bar">
            {props.tabValue === 'timed-auction'
                ? <h2 className="title">{variables[props.lang]['auction_confirmation']}</h2>
                : <h2 className="title">{variables[props.lang]['list_nft_confirmation']}</h2>}
            <div className="ledger_note">
                <p>{variables[props.lang]['ledger_note']}</p>
            </div>
            <div className="row1">
                <div className="left_section">
                    {mediaType && props.data && props.data.info &&
                    getAssetType(mediaType) === 'image' && getAssetTypeExtension(mediaType) === 'gif'
                        ? <ImageOnLoad
                            preview={props.data.info.preview_uri}
                            src={props.data.info.media_uri}
                            text={variables[props.lang]['asset_preview_not_ready']}/>
                        : mediaType &&
                        getAssetType(mediaType) === 'image' && props.data && props.data.info
                            ? <ImageOnLoad
                                cdn={props.data.info.cloudflare_cdn && props.data.info.cloudflare_cdn.variants}
                                preview={props.data.info.preview_uri}
                                src={props.data.info.media_uri}
                                text={variables[props.lang]['asset_preview_not_ready']}/>
                            : props.data && props.data.info
                                ? <ImageOnLoad
                                    preview={props.data.info.preview_uri}
                                    src={props.data.info.media_uri}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>
                                : <ImageOnLoad
                                    src={thumbnail}
                                    text={variables[props.lang]['asset_preview_not_ready']}/>}
                    <div className="row">
                        <div className="names">
                            <span>
                                {collection && (collection.name || collection.symbol)}
                            </span>
                            <p>{props.data && props.data.info && props.data.info.name}</p>
                        </div>
                        <div className="price">
                            <span>List price</span>
                            <p>
                                <NetworkImages name={name}/>
                                {price}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="right_section">
                    <div className="row">
                        <span>{variables[props.lang].message_type}</span>
                        {customTypes.ListNFT && customTypes.ListNFT.typeUrl && customTypes.ListNFT.typeUrl.length > 20
                            ? <div className="hash_text hash_text_content">
                                <p className="name">{customTypes.ListNFT && customTypes.ListNFT.typeUrl}</p>
                                {customTypes.ListNFT && customTypes.ListNFT.typeUrl &&
                                    customTypes.ListNFT.typeUrl.slice(customTypes.ListNFT.typeUrl.length - 10, customTypes.ListNFT.typeUrl.length)}
                            </div>
                            : <p>{customTypes.ListNFT && customTypes.ListNFT.typeUrl}</p>}
                    </div>
                    <div className="row">
                        <span>{variables[props.lang].nft_id}</span>
                        {props.data && props.data.info && props.data.info.id && props.data.info.id.length > 20
                            ? <div className="hash_text hash_text_content">
                                <p className="name">{props.data && props.data.info && props.data.info.id}</p>
                                {props.data && props.data.info && props.data.info.id &&
                                    props.data.info.id.slice(props.data.info.id.length - 6, props.data.info.id.length)}
                            </div>
                            : <p>
                                {props.data && props.data.info && props.data.info.id}
                            </p>}
                    </div>
                    <div className="row">
                        <span>{variables[props.lang].denom_id}</span>
                        {collection && collection.id && collection.id.length > 20
                            ? <div className="hash_text hash_text_content">
                                <p className="name">{collection && collection.id}</p>
                                {collection.id &&
                                    collection.id.slice(collection.id.length - 6, collection.id.length)}
                            </div>
                            : <p>{collection && collection.id}</p>}
                    </div>
                    <div className="row">
                        <span>{variables[props.lang].listed_type}</span>
                        <p>{props.listType === 'timed-auction'
                            ? variables[props.lang]['timed_auction']
                            : props.listType}</p>
                    </div>
                    <div className="row">
                        <span>{variables[props.lang].price}</span>
                        <p>{price} {name}</p>
                    </div>
                    {props.listType === 'timed-auction' &&
                        <div className="row">
                            <span>{variables[props.lang].bid_increment_per}</span>
                            <p>{props.bidPercentage} {' %'}</p>
                        </div>}
                    {props.listType === 'timed-auction' &&
                        <div className="row">
                            <span>{variables[props.lang]['start_time']}</span>
                            <p>{props.startDate && moment(props.startDate).format('MMM Do \'YY LT')}</p>
                        </div>}
                    {props.listType === 'timed-auction' &&
                        <div className="row">
                            <span>{variables[props.lang]['end_time']}</span>
                            <p>{props.endDate && moment(props.endDate).format('MMM Do \'YY LT')}</p>
                        </div>}
                    {props.listType === 'timed-auction' && props.whiteListSwitch &&
                        <div className="row">
                            <span>{variables[props.lang].whitelist}</span>
                            <p>Yes</p>
                        </div>}
                    <TotalSale totalSale={totalSale}/>
                </div>
            </div>
            <div className="confirm_list_action transfer_action">
                <Button
                    className="cancel_button"
                    onClick={props.handleClose}>
                    {variables[props.lang].cancel}
                </Button>
                {props.tabValue === 'timed-auction'
                    ? <Button
                        className="transfer_confirm"
                        disabled={props.disable}
                        onClick={props.handleCreateAuction}>
                        {props.broadCastInProgress
                            ? variables[props.lang].processing + '...'
                            : props.inProgress
                                ? variables[props.lang]['approval_pending'] + '...'
                                : variables[props.lang]['confirm_auction']}
                    </Button>
                    : <Button
                        className="transfer_confirm"
                        disabled={props.disable}
                        onClick={props.handleSuccess}>
                        {props.broadCastInProgress
                            ? variables[props.lang].processing + '...'
                            : props.inProgress
                                ? variables[props.lang]['approval_pending'] + '...'
                                : variables[props.lang].confirm_listing}
                    </Button>}
            </div>
        </DialogContent>
    );
};

ConfirmListingDialog.propTypes = {
    bidPercentage: PropTypes.number.isRequired,
    broadCastInProgress: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    details: PropTypes.object.isRequired,
    disable: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCreateAuction: PropTypes.func.isRequired,
    handleSuccess: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    listType: PropTypes.string.isRequired,
    splitInfo: PropTypes.array.isRequired,
    splitInfoStatus: PropTypes.bool.isRequired,
    tabValue: PropTypes.string.isRequired,
    tokenPrice: PropTypes.string.isRequired,
    whiteListSwitch: PropTypes.bool.isRequired,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    tokenValue: PropTypes.object,
};

const stateToProps = (state) => {
    return {
        data: state.marketplace.confirmListing.value,
        lang: state.language,
        splitInfo: state.marketplace.splitInfo.value,
        splitInfoStatus: state.marketplace.splitInfo.status,
        tokenValue: state.marketplace.sellTokenValue.value,
        tokenPrice: state.marketplace.sellTokenPrice,
        details: state.marketplace.sellDialog.value,
        listType: state.marketplace.listType,
        whiteListSwitch: state.marketplace.whiteListSwitch,
        endDate: state.marketplace.endDate,
        startDate: state.marketplace.startDate,
        bidPercentage: state.marketplace.bidPercentage,
        tabValue: state.marketplace.listType,
    };
};

const actionToProps = {
    handleClose: hideSellDialog,
};

export default connect(stateToProps, actionToProps)(ConfirmListingDialog);
