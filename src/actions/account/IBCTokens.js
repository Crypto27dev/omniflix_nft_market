import {
    AMINO_SIGN_IBC_TX_ERROR,
    AMINO_SIGN_IBC_TX_IN_PROGRESS,
    AMINO_SIGN_IBC_TX_SUCCESS,
    CONNECT_IBC_ACCOUNT_ERROR,
    CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    CONNECT_IBC_ACCOUNT_SUCCESS,
    IBC_BALANCE_FETCH_ERROR,
    IBC_BALANCE_FETCH_IN_PROGRESS,
    IBC_BALANCE_FETCH_SUCCESS,
    IBC_TX_IN_PROGRESS_SET,
    TIMEOUT_HEIGHT_FETCH_ERROR,
    TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    TIMEOUT_HEIGHT_FETCH_SUCCESS,
} from '../../constants/IBCTokens';
import { urlFetchIBCBalance, urlFetchTimeoutHeight } from '../../constants/restURL';
import Axios from 'axios';
import { SigningStargateClient } from '@cosmjs/stargate';
import { payloadId } from '@walletconnect/utils';

const connectIBCAccountInProgress = () => {
    return {
        type: CONNECT_IBC_ACCOUNT_IN_PROGRESS,
    };
};

const connectIBCAccountSuccess = (value) => {
    return {
        type: CONNECT_IBC_ACCOUNT_SUCCESS,
        value,
    };
};

const connectIBCAccountError = (message) => {
    return {
        type: CONNECT_IBC_ACCOUNT_ERROR,
        message,
        variant: 'error',
    };
};

export const connectIBCAccount = (data, cb) => (dispatch) => {
    dispatch(connectIBCAccountInProgress());
    const prefix = data.PREFIX;
    const chainConfig = {
        chainId: data.CHAIN_ID,
        chainName: data.CHAIN_NAME,
        rpc: data.RPC_URL,
        rest: data.REST_URL,
        stakeCurrency: {
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: `${prefix}`,
            bech32PrefixAccPub: `${prefix}pub`,
            bech32PrefixValAddr: `${prefix}valoper`,
            bech32PrefixValPub: `${prefix}valoperpub`,
            bech32PrefixConsAddr: `${prefix}valcons`,
            bech32PrefixConsPub: `${prefix}valconspub`,
        },
        currencies: [{
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
        }],
        feeCurrencies: [{
            coinDenom: data.COIN_DENOM,
            coinMinimalDenom: data.COIN_MINIMAL_DENOM,
            coinDecimals: data.COIN_DECIMALS,
            gasPriceStep: {
                low: 0.1,
                average: 0.5,
                high: 1,
            },
        }],
        coinType: 118,
        features: ['ibc-transfer'],
    };

    (async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            const error = 'Please install keplr extension';
            dispatch(connectIBCAccountError(error));
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    dispatch(connectIBCAccountError(chainError));
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                dispatch(connectIBCAccountError(versionError));
            }
        }

        if (window.keplr) {
            window.keplr.enable(data.CHAIN_ID)
                .then(async () => {
                    const offlineSigner = window.getOfflineSigner(data.CHAIN_ID);
                    const accounts = await offlineSigner.getAccounts();
                    dispatch(connectIBCAccountSuccess(accounts));
                    cb(accounts);
                }).catch((error) => {
                    dispatch(connectIBCAccountError(error.toString()));
                });
        } else {
            return null;
        }
    })();
};

export const walletConnectIBCAccount = (connector, data, cb) => (dispatch) => {
    dispatch(connectIBCAccountInProgress());
    connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_accounts_v1',
        params: [data.CHAIN_ID],
    }).then((accounts) => {
        dispatch(connectIBCAccountSuccess(accounts));
        cb(accounts);
    }).catch((error) => {
        dispatch(connectIBCAccountError(error.message));
        cb(null);
    });
};

const fetchIBCBalanceInProgress = () => {
    return {
        type: IBC_BALANCE_FETCH_IN_PROGRESS,
    };
};

const fetchIBCBalanceSuccess = (value) => {
    return {
        type: IBC_BALANCE_FETCH_SUCCESS,
        value,
    };
};

const fetchIBCBalanceError = (message) => {
    return {
        type: IBC_BALANCE_FETCH_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchIBCBalance = (ibcUrl, address) => (dispatch) => {
    dispatch(fetchIBCBalanceInProgress());

    const url = urlFetchIBCBalance(ibcUrl, address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchIBCBalanceSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(fetchIBCBalanceError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};

const aminoSignIBCTxInProgress = () => {
    return {
        type: AMINO_SIGN_IBC_TX_IN_PROGRESS,
    };
};

const aminoSignIBCTxSuccess = (value) => {
    return {
        type: AMINO_SIGN_IBC_TX_SUCCESS,
        value,
        message: 'Transaction Success. Token Transfer in progress...',
        variant: 'success',
    };
};

const aminoSignIBCTxError = (message) => {
    return {
        type: AMINO_SIGN_IBC_TX_ERROR,
        message,
        variant: 'error',
    };
};

export const aminoSignIBCTx = (config, tx, cb) => (dispatch) => {
    dispatch(aminoSignIBCTxInProgress());

    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(config.CHAIN_ID);
        const client = await SigningStargateClient.connectWithSigner(
            config.RPC_URL,
            offlineSigner,
        );

        client.sendIbcTokens(
            tx.msg && tx.msg.value && tx.msg.value.sender,
            tx.msg && tx.msg.value && tx.msg.value.receiver,
            tx.msg && tx.msg.value && tx.msg.value.token,
            tx.msg && tx.msg.value && tx.msg.value.source_port,
            tx.msg && tx.msg.value && tx.msg.value.source_channel,
            tx.msg && tx.msg.value && tx.msg.value.timeout_height,
            tx.msg && tx.msg.value && tx.msg.value.timeout_timestamp,
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                dispatch(aminoSignIBCTxError(result.log || result.rawLog));
                cb(null);
            } else {
                dispatch(aminoSignIBCTxSuccess(result));
                cb(result);
            }
        }).catch((error) => {
            dispatch(aminoSignIBCTxError(error && error.message));
            cb(null);
        });
    })();
};

const fetchTimeoutHeightInProgress = () => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_IN_PROGRESS,
    };
};

const fetchTimeoutHeightSuccess = (value) => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_SUCCESS,
        value,
    };
};

const fetchTimeoutHeightError = (message) => {
    return {
        type: TIMEOUT_HEIGHT_FETCH_ERROR,
        message,
        variant: 'error',
    };
};

export const fetchTimeoutHeight = (URL, channel, cb) => (dispatch) => {
    dispatch(fetchTimeoutHeightInProgress());

    const url = urlFetchTimeoutHeight(URL, channel);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            dispatch(fetchTimeoutHeightSuccess(res.data));
            cb(res.data);
        })
        .catch((error) => {
            dispatch(fetchTimeoutHeightError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const setIBCTxInProgress = (value) => {
    return {
        type: IBC_TX_IN_PROGRESS_SET,
        value,
    };
};
