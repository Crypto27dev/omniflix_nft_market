import React from 'react';
import DataTable from '../../../components/DataTable';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, Tooltip } from '@material-ui/core';
import { showDepositeDialog, showWithdrawDialog } from '../../../actions/myAccount';
import { config } from '../../../config';
import { commaSeparator, splitDecimals } from '../../../utils/numbers';
import { withRouter } from 'react-router';
import NetworkImages from '../../../components/NetworkImages';
import variables from '../../../utils/variables';
import { ReactComponent as CopyRight } from '../../../assets/copy-right.svg';
import TextSkeletonLoader from '../../../components/SkeletonLoader/CollectionTable/Text';
import ImageSkeletonLoader from '../../../components/SkeletonLoader/CollectionTable/Image';

const Table = (props) => {
    const options = {
        textLabels: {
            body: {
                noMatch: <div className="no_data_table"> No data found </div>,
                toolTip: 'Sort',
            },
            viewColumns: {
                title: 'Show Columns',
                titleAria: 'Show/Hide Table Columns',
            },
        },
        responsive: 'standard',
        selectableRows: 'none',
        download: false,
        filter: false,
        print: false,
        search: false,
        viewColumns: false,
    };

    const columns = [{
        name: 'token',
        label: 'Token',
        options: {
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <div className="token_value">
                        <ImageSkeletonLoader/>
                        <TextSkeletonLoader width="80%"/>
                    </div>;
                }

                return (
                    <div className="token_value">
                        <NetworkImages name={value}/>
                        <span>{value}</span>
                        {value === 'ATOM/CH-0'
                            ? <Tooltip
                                classes={{ popper: 'warning_ibc_tooltip' }} placement="bottom-start" title={
                                    <div className="text_content">
                                        <CopyRight/>
                                        {`"${value}" ${variables[props.lang]['ibc_deprecated_text']} "${value}"`}
                                    </div>}>
                                <CopyRight/>
                            </Tooltip> : null}
                    </div>
                );
            },
        },
    }, {
        name: 'amount',
        label: 'Amount',
        options: {
            sort: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                const denom = value && value.ibc_denom_hash
                    ? value.ibc_denom_hash
                    : config.COIN_MINIMAL_DENOM;
                const decimals = value && value.network && value.network.decimals
                    ? value.network.decimals
                    : config.COIN_DECIMALS;

                let balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
                balance = balance && balance.amount && splitDecimals(balance.amount / (10 ** decimals));

                return (
                    <div className="amount_value">
                        {balance && balance.length
                            ? <>
                                {balance.length && balance[0] && commaSeparator(balance[0])}
                                {balance.length && balance[1] &&
                                    <span>.{balance.length && balance[1]}</span>}
                            </>
                            : 0}
                    </div>
                );
            },
        },
    }, {
        name: 'ibc_deposit',
        label: 'IBC Deposit',
        options: {
            sort: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                const navAddress = props.match && props.match.params && props.match.params.address;
                const denom = value && value.ibc_denom_hash
                    ? value.ibc_denom_hash
                    : config.COIN_MINIMAL_DENOM;
                const buttonsDisable = value && value.status && (value.status !== 'ENABLED');

                return (
                    navAddress === props.address
                        ? (denom !== 'uflix' &&
                            <Button
                                className="deposite_value"
                                disabled={buttonsDisable}
                                onClick={() => props.showDepositeDialog(value)}>
                                Deposit
                            </Button>)
                        : '-'
                );
            },
        },
    }, {
        name: 'ibc_withdraw',
        label: 'IBC Withdraw',
        options: {
            sort: false,
            customBodyRender: function (value) {
                if (value === 'skeleton-loader') {
                    return <TextSkeletonLoader width="80%"/>;
                }

                const navAddress = props.match && props.match.params && props.match.params.address;
                const denom = value && value.ibc_denom_hash
                    ? value.ibc_denom_hash
                    : config.COIN_MINIMAL_DENOM;

                const balance = props.balance && props.balance.length && props.balance.find((val) => val.denom === denom);
                const disable = !balance || balance < 0;
                const buttonsDisable = value && value.status && (value.status !== 'ENABLED');

                return (
                    navAddress === props.address
                        ? (denom !== 'uflix' && <Button
                            className="deposite_value"
                            disabled={disable || buttonsDisable}
                            onClick={() => props.showWithdrawDialog(value)}>
                            Withdraw
                        </Button>)
                        : '-'
                );
            },
        },
    }];

    const list = props.data && props.data.length &&
        props.data.filter((val) => val.status === 'ENABLED');

    const tableData = list && list.length
        ? list.map((item) => [
            item.network && item.network.display_denom ? item.network.display_denom : item.label,
            item,
            item,
            item,
        ]) : [];

    const loadingData = Array.from(new Array(10)).map((item, index) => [
        'skeleton-loader',
        'skeleton-loader',
        'skeleton-loader',
        'skeleton-loader',
    ]);

    const inProgress = props.balanceInProgress || props.tokensListInProgress;

    return (
        <>
            <DataTable
                columns={columns}
                data={inProgress ? loadingData : tableData}
                name=""
                options={options}/>
        </>
    );
};

Table.propTypes = {
    address: PropTypes.string.isRequired,
    balance: PropTypes.array.isRequired,
    balanceInProgress: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    lang: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            address: PropTypes.string.isRequired,
            tab: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    showDepositeDialog: PropTypes.func.isRequired,
    showWithdrawDialog: PropTypes.func.isRequired,
    tokensListInProgress: PropTypes.bool.isRequired,
};

const stateToProps = (state) => {
    return {
        address: state.account.wallet.connection.address,
        balance: state.myAccount.userBalance.value,
        balanceInProgress: state.myAccount.userBalance.inProgress,
        data: state.account.chainID.list,
        tokensListInProgress: state.account.chainID.inProgress,
        lang: state.language,
    };
};

const actionToProps = {
    showDepositeDialog,
    showWithdrawDialog,
};

export default withRouter(connect(stateToProps, actionToProps)(Table));
