import React from 'react';
import DataTable from '../../components/DataTable';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
// import Icon from '../../components/Icon';
import CircularProgress from '../../components/CircularProgress';
import { config } from '../../config';
import moment from 'moment';
import { withRouter } from 'react-router';
import { fetchCollectionActivity } from '../../actions/activity';
import { tokensList } from '../../utils/defaultOptions';
import { Tooltip } from '@mui/material';

const ActivityTable = (props) => {
    const id = props.match && props.match.params && props.match.params.id;

    const options = {
        textLabels: {
            body: {
                noMatch: props.inProgress
                    ? <CircularProgress/>
                    : <div className="no_data_table"> No data found </div>,
                toolTip: 'Sort',
            },
            viewColumns: {
                title: 'Show Columns',
                titleAria: 'Show/Hide Table Columns',
            },
        },
        onChangePage: (currentPage) => {
            if (props.activities && props.activities.length === 0) {
                return;
            }

            props.fetchCollectionActivity(id, props.limit * currentPage, props.limit, props.sortBy, null);
        },
        onChangeRowsPerPage: (numberOfRows) => {
            if (props.activities && props.activities.length === 0) {
                return;
            }

            props.fetchCollectionActivity(id, props.skip, numberOfRows, props.sortBy, null);
        },
        onColumnSortChange: (changedColumn, direction) => {
            if (props.activities && props.activities.length === 0) {
                return;
            }

            props.fetchCollectionActivity(id, props.skip, props.limit, changedColumn, direction);
        },
        responsive: 'standard',
        serverSide: true,
        pagination: true,
        count: props.total,
        selectableRows: 'none',
        download: false,
        filter: false,
        print: false,
        search: false,
        viewColumns: false,
    };

    const columns = [{
        name: 'type',
        label: 'Type',
        options: {
            customBodyRender: function (value) {
                const type = value === 'MsgListNFT'
                    ? 'List NFT'
                    : value === 'MsgMintONFT'
                        ? 'Mint NFT'
                        : value === 'MsgBuyNFT'
                            ? 'Buy NFT'
                            : value === 'MsgDeListNFT'
                                ? 'Delist NFT'
                                : value === 'MsgBurnONFT'
                                    ? 'Burn NFT'
                                    : value === 'MsgCreateDenom'
                                        ? 'Mint Collection'
                                        : value === 'MsgTransferONFT'
                                            ? 'Transfer NFT'
                                            : value === 'MsgSend'
                                                ? 'Send'
                                                : value === 'MsgSubmitProposal'
                                                    ? 'Submit Proposal'
                                                    : value === 'MsgVote'
                                                        ? 'Vote'
                                                        : value === 'MsgDelegate'
                                                            ? 'Delegate'
                                                            : value;
                return (
                    <div className="type_value">
                        {type}
                    </div>
                );
            },
        },
    }, {
        name: 'token_id',
        label: 'Token ID/Amount',
        options: {
            sort: false,
            customBodyRender: function (value) {
                const amount = (value &&
                    value.amount) / (10 ** config.COIN_DECIMALS);
                const ibcToken = value && value.denom &&
                    props.ibcTokensList && props.ibcTokensList.length &&
                    props.ibcTokensList.find((val) => val && val.ibc_denom_hash && (val.ibc_denom_hash === value.denom));
                const tokenType = value && value.denom &&
                    tokensList.find((val) => val.value === value.denom);

                return (
                    (value && value.amount && value.denom && ibcToken && ibcToken.network)
                        ? <div className="token_amount">
                            <div className={amount > 0 ? 'positive_value' : 'negative_value'}>
                                {amount}
                            </div>
                            <span> {(ibcToken && ibcToken.network && ibcToken.network.display_denom) ||
                                (value.denom)}</span>
                        </div>
                        : (value && value.amount && value.denom)
                            ? <div className="token_amount">
                                <div className={amount > 0 ? 'positive_value' : 'negative_value'}>
                                    {amount}
                                </div>
                                <span> {(tokenType && tokenType.label) || (value.denom)}</span>
                            </div>
                            : <div className="token_amount">-</div>
                );
            },
        },
    }, {
        name: 'name',
        label: 'NFT Name',
        options: {
            sort: false,
            customBodyRender: function (value) {
                return (
                    value
                        ? <Tooltip title={value}>
                            <div className="from_value tx_hash">
                                {value}
                            </div>
                        </Tooltip>
                        : <div className="from_value tx_hash">-</div>
                );
            },
        },
    }, {
        name: 'sender',
        label: 'From Address',
        options: {
            customBodyRender: function (value) {
                return (
                    <div className="to_value tx_hash">
                        <div className="hash_text" title={value}>
                            <p className="name">{value}</p>
                            {value &&
                                value.slice(value.length - 6, value.length)}
                        </div>
                    </div>
                );
            },
        },
    }, {
        name: 'recipient',
        label: 'To Address',
        options: {
            customBodyRender: function (value) {
                return (
                    <div className="to_value tx_hash">
                        <div className="hash_text" title={value}>
                            <p className="name">{value}</p>
                            {value &&
                                value.slice(value.length - 6, value.length)}
                        </div>
                    </div>
                );
            },
        },
    }, {
        name: 'created_at',
        label: 'Time',
        options: {
            customBodyRender: function (value) {
                return (
                    <div className="time">
                        {value ? moment(value).fromNow() : null}
                    </div>
                );
            },
        },
        // }, {
        //     name: 'link',
        //     label: 'Link',
        //     options: {
        //         customBodyRender: function () {
        //             return (
        //                 <div className="link_div">
        //                     <Icon className="link" icon="link"/>
        //                 </div>
        //             );
        //         },
        //     },
    }];

    const tableData =
        props.activities && props.activities.length > 0
            ? props.activities.map((item, index) => [
                item.type ? item.type : '-',
                item.price ? item.price
                    : item.amount && item.amount.length > 0 && item.amount[0]
                        ? item.amount[0] : null,
                (item.metadata && item.metadata.name)
                    ? item.metadata.name
                    : item.nft_id && item.nft_id.name
                        ? item.nft_id.name
                        : item.name ? item.name : null,
                item.sender ? item.sender : item.from_address ? item.from_address : '-',
                item.recipient ? item.recipient : item.to_address ? item.to_address : '-',
                item.created_at ? item.created_at : '-',
            ])
            : [];

    return (
        <>
            <DataTable
                columns={columns}
                data={tableData}
                name=""
                options={options}/>
        </>
    );
};

ActivityTable.propTypes = {
    activities: PropTypes.array.isRequired,
    fetchCollectionActivity: PropTypes.func.isRequired,
    ibcTokensList: PropTypes.array.isRequired,
    ibcTokensListInProgress: PropTypes.bool.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    limit: PropTypes.number.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    skip: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    order: PropTypes.number,
};

const stateToProps = (state) => {
    return {
        lang: state.language,
        activities: state.activity.collectionActivity.result,
        inProgress: state.activity.collectionActivity.inProgress,
        total: state.activity.collectionActivity.total,
        skip: state.activity.collectionActivity.skip,
        limit: state.activity.collectionActivity.limit,
        sortBy: state.activity.collectionActivity.sortBy,
        order: state.activity.collectionActivity.order,

        ibcTokensList: state.marketplace.ibcTokensList.value,
        ibcTokensListInProgress: state.marketplace.ibcTokensList.inProgress,
    };
};

const actionToProps = {
    fetchCollectionActivity,
};

export default withRouter(connect(stateToProps, actionToProps)(ActivityTable));
