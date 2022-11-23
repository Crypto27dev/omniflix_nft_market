import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import successIcon from '../../../assets/success.svg';
import CopyButton from '../../../components/CopyButton';
import shareIcon from '../../../assets/my-account/share.svg';
import copyIcon from '../../../assets/my-account/copy.svg';
import '../../MyAccount/Activity/index.css';
import { config, EXPLORER_URL } from '../../../config';
import { tokensList } from '../../../utils/defaultOptions';
import NetworkImages from '../../../components/NetworkImages';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import calendarIcon from '../../../assets/my-account/calendar.svg';
import { MsgTypes } from '../../../utils/strings';
import NoData from '../../../components/NoData';
import SkeletonLoader from '../../../components/SkeletonLoader';

class Activity extends Component {
    render () {
        return (
            <>
                {this.props.inProgress && this.props.activities && (this.props.activities.length === 0)
                    ? <SkeletonLoader start={true} type="activity"/>
                    : this.props.activities && this.props.activities.length > 0
                        ? this.props.activities.map((value, index) => {
                            const activityPrice = value.price ? value.price
                                : value.amount && value.amount.length > 0 && value.amount[0]
                                    ? value.amount[0] : value.amount ? value.amount : null;
                            const amount = (activityPrice &&
                                activityPrice.amount) / (10 ** config.COIN_DECIMALS);
                            const ibcToken = activityPrice && activityPrice.denom &&
                                this.props.ibcTokensList && this.props.ibcTokensList.length &&
                                this.props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === activityPrice.denom));
                            // eslint-disable-next-line no-unused-vars
                            const tokenType = activityPrice && activityPrice.denom &&
                                tokensList.find((val) => val.value === activityPrice.denom);

                            const denom = ibcToken && ibcToken.network && ibcToken.network.display_denom
                                ? ibcToken.network.display_denom : config.COIN_DENOM;

                            const type = MsgTypes(value, this.props.address);
                            return (
                                <div key={index} className="activity_section">
                                    <div className="activity_timeline">
                                        {index === 0 && <div className="calendar_date">
                                            <img alt="calendar" src={calendarIcon}/>
                                            {moment().format('DD-MM-YYYY')}
                                        </div>}
                                        <div/>
                                        <p className="created_at">{value.created_at &&
                                            moment(value.created_at).fromNow()}</p>
                                        <div/>
                                    </div>
                                    <div className="activity_card">
                                        <div className="card_section1">
                                            {/* {value.status === 'success' */}
                                            {/*    ? */}
                                            <img alt="logo" src={successIcon}/>
                                            {/*: value.status === 'failed' */}
                                            {/*    ? <img alt="logo" src={failedIcon} /> */}
                                            {/*    : null} */}
                                            <div className="name">
                                                <span>{type || ''}</span>
                                                {value.sender &&
                                                    <div className="transfer">
                                                        <span>from:</span>
                                                        <div className="hash_text" title={value.sender}>
                                                            <p className="name">{value.sender}</p>
                                                            {value.sender &&
                                                                value.sender.slice(value.sender.length - 6, value.sender.length)}
                                                        </div>
                                                    </div>}
                                                {value.recipient &&
                                                    <div className="transfer">
                                                        <span>To:</span>
                                                        <div className="hash_text" title={value.recipient}>
                                                            <p className="name">{value.recipient}</p>
                                                            {value.recipient &&
                                                                value.recipient.slice(value.recipient.length - 6, value.recipient.length)}
                                                        </div>
                                                    </div>}
                                                {(value.type === 'MsgMintONFT' || value.type === 'MsgCreateDenom') &&
                                                    <div className="transfer">
                                                        {value.type === 'MsgMintONFT'
                                                            ? <span>To:</span>
                                                            : <span>Creator:</span>}
                                                        <div className="hash_text" title={value.creator}>
                                                            <p className="name">{value.creator}</p>
                                                            {value.creator &&
                                                                value.creator.slice(value.creator.length - 6, value.creator.length)}
                                                        </div>
                                                    </div>}
                                                {value.type === 'ProcessBid' &&
                                                    <div className="transfer">
                                                        <span>Bidder:</span>
                                                        <div className="hash_text" title={value.bidder}>
                                                            <p className="name">{value.bidder}</p>
                                                            {value.bidder &&
                                                                value.bidder.slice(value.bidder.length - 6, value.bidder.length)}
                                                        </div>
                                                    </div>}
                                                {(value.price || value.amount) &&
                                                    <div className="action">
                                                        <div>
                                                            <NetworkImages name={denom}/>
                                                            {amount}
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                        <div className="card_section2">
                                            {
                                                // value.denom_id && value.denom_id.name &&
                                                (value.name || (value.nft_id && value.nft_id.name)) &&
                                                <div className="nft_collection">
                                                    {/* <Tooltip title={value.denom_id && value.denom_id.name}> */}
                                                    {/*    <span>{value.denom_id && value.denom_id.name}</span> */}
                                                    {/* </Tooltip> */}
                                                    <Tooltip title={value.name || (value.nft_id && value.nft_id.name)}>
                                                        <p>{value.name || (value.nft_id && value.nft_id.name)}</p>
                                                    </Tooltip>
                                                </div>}
                                        </div>
                                        {value.tx_hash && value.tx_hash !== '-' && value.tx_hash !== ''
                                            ? <div className="card_section3">
                                                <div className="txn_hash">
                                                    <span>TxnHash</span>
                                                    <p>{value.tx_hash}</p>
                                                </div>
                                                <div className="card_actions">
                                                    <CopyButton
                                                        data={EXPLORER_URL + '/transactions/' + value.tx_hash}
                                                        icon={copyIcon}/>
                                                    <img
                                                        alt="share"
                                                        src={shareIcon}
                                                        onClick={() => window.open(EXPLORER_URL + '/transactions/' + value.tx_hash)}/>
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                </div>
                            );
                        }) : <NoData/>}
                {this.props.activities && this.props.activities.length && this.props.inProgress
                    ? <SkeletonLoader type="activity"/> : null}
            </>
        );
    }
}

Activity.propTypes = {
    activities: PropTypes.array.isRequired,
    address: PropTypes.string.isRequired,
    fetchUserActivity: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    limit: PropTypes.number.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    skip: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        lang: state.language,
        activities: state.activity.collectionActivity.result,
        skip: state.activity.collectionActivity.skip,
        limit: state.activity.collectionActivity.limit,
        inProgress: state.activity.collectionActivity.inProgress,
        total: state.activity.collectionActivity.total,

        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

export default withRouter(connect(stateToProps)(Activity));
