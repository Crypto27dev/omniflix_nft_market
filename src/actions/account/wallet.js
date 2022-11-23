import {
    CONNECT_KEPLR_ACCOUNT_ERROR,
    CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    CONNECT_KEPLR_ACCOUNT_SUCCESS,
    TX_HASH_FETCH_ERROR,
    TX_HASH_FETCH_IN_PROGRESS,
    TX_HASH_FETCH_SUCCESS,
    TX_HASH_IN_PROGRESS_FALSE_SET,
    TX_SIGN_AND_BROAD_CAST_ERROR,
    TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    TX_SIGN_AND_BROAD_CAST_SUCCESS,
    TX_SIGN_ERROR,
    TX_SIGN_IN_PROGRESS,
    TX_SIGN_SUCCESS,
    WALLET_CONNECT_ERROR,
    WALLET_CONNECT_IN_PROGRESS,
    WALLET_CONNECT_SUCCESS,
} from '../../constants/wallet';
import { chainConfig, chainId, config, EXPLORER_URL } from '../../config';
import { defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { encodePubkey, makeSignDoc, Registry } from '@cosmjs/proto-signing';
import { makeSignDoc as AminoMakeSignDoc } from '@cosmjs/amino';
import { AuthInfo, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Axios from 'axios';
import { KEPLR_ACCOUNT_KEYS_SET } from '../../constants/account';
import { customRegistry, customTypes } from '../../registry';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { convertToCamelCase } from '../../utils/strings';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino/build/encoding';
import WalletConnect from '@walletconnect/client';
import { CosmostationWCModal } from '../../components/QRModal';
import { payloadId } from '@walletconnect/utils';
import { setDisconnect } from './index';
import { urlFetchAccount, urlFetchIBCAccount, urlFetchSimulate } from '../../constants/url';

const connectKeplrAccountInProgress = () => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_IN_PROGRESS,
    };
};

const connectKeplrAccountSuccess = (value) => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_SUCCESS,
        value,
    };
};

const connectKeplrAccountError = (message) => {
    return {
        type: CONNECT_KEPLR_ACCOUNT_ERROR,
        message,
        variant: 'error',
    };
};

const setKeplrAccountKeys = (value) => {
    return {
        type: KEPLR_ACCOUNT_KEYS_SET,
        value,
    };
};

export const initializeChain = (cb) => (dispatch) => {
    dispatch(connectKeplrAccountInProgress());
    (async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            const error = 'Please install keplr extension';
            dispatch(connectKeplrAccountError(error));
        } else {
            if (window.keplr.experimentalSuggestChain) {
                try {
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    dispatch(connectKeplrAccountError(chainError));
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                dispatch(connectKeplrAccountError(versionError));
            }
        }

        if (window.keplr) {
            window.keplr.enable(chainId)
                .then(async () => {
                    const offlineSigner = window.getOfflineSigner(chainId);
                    const accounts = await offlineSigner.getAccounts();
                    dispatch(connectKeplrAccountSuccess(accounts));
                    cb(accounts);
                }).catch((error) => {
                    dispatch(connectKeplrAccountError(error.toString()));
                });
            window.keplr && window.keplr.getKey(chainId)
                .then((res) => {
                    dispatch(setKeplrAccountKeys(res));
                }).catch(() => {

                });
        } else {
            return null;
        }
    })();
};

const walletConnectInProgress = () => {
    return {
        type: WALLET_CONNECT_IN_PROGRESS,
    };
};

const walletConnectSuccess = (value, account) => {
    return {
        type: WALLET_CONNECT_SUCCESS,
        value,
        account,
    };
};

const walletConnectError = (message) => {
    return {
        type: WALLET_CONNECT_ERROR,
        message,
        variant: 'error',
    };
};

export const walletConnect = (address, cb) => (dispatch) => {
    dispatch(walletConnectInProgress());
    (async () => {
        const connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org',
            signingMethods: [
                'cosmostation_wc_accounts_v1',
                'cosmostation_wc_sign_tx_v1',
            ],
            qrcodeModal: new CosmostationWCModal(),
        });

        if (!connector.connected) {
            localStorage.removeItem('of_marketplace_wallet_connect');
            localStorage.removeItem('of_nucleus_address');
        }

        if (connector.connected && address) {
            await connector.killSession();
            localStorage.removeItem('of_marketplace_wallet_connect');
            localStorage.removeItem('of_nucleus_address');
        }

        if (connector.connected) {
            const account = (localStorage.getItem('of_marketplace_wallet_connect') &&
                JSON.parse(localStorage.getItem('of_marketplace_wallet_connect'))) || [];
            dispatch(walletConnectSuccess(connector, account));
            cb(connector, account);

            return;
        }

        await connector.createSession();

        connector.on('disconnect', (error, payload) => {
            if (error) {
                dispatch(walletConnectError(error));
                cb(null);

                return;
            }

            connector.killSession();
            setDisconnect();
            localStorage.removeItem('of_marketplace_wallet_connect');
            localStorage.removeItem('of_nucleus_address');
        });
        connector.on('connect', (error, payload) => {
            if (error) {
                dispatch(walletConnectError(error));
                cb(null);

                return;
            }

            dispatch(walletConnectAccount(connector, cb));
        });
    })();
};

const walletConnectAccount = (connector, cb) => (dispatch) => {
    connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_accounts_v1',
        params: [config.CHAIN_ID],
    }).then((accounts) => {
        dispatch(walletConnectSuccess(connector, accounts));
        cb(connector, accounts);
    }).catch((error) => {
        dispatch(walletConnectError(error.message));
        cb(null);
    });
};

const signTxInProgress = () => {
    return {
        type: TX_SIGN_IN_PROGRESS,
    };
};

// const setSignTxInProgress = (value) => {
//     return {
//         type: TX_SIGN_IN_PROGRESS_SET,
//         value,
//     };
// };

const signTxSuccess = (value) => {
    return {
        type: TX_SIGN_SUCCESS,
        value,
    };
};

const signTxError = (message) => {
    return {
        type: TX_SIGN_ERROR,
        message,
        variant: 'error',
    };
};

export const aminoSignTx = (tx, address, cb) => (dispatch) => {
    dispatch(signTxInProgress());
    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSigner && window.getOfflineSigner(config.CHAIN_ID);

        try {
            const client = await SigningStargateClient.connectWithSigner(
                config.RPC_URL,
                offlineSigner,
            );

            const account = {};
            try {
                const {
                    accountNumber,
                    sequence,
                } = await client.getSequence(address);
                account.accountNumber = accountNumber;
                account.sequence = sequence;
            } catch (e) {
                account.accountNumber = 0;
                account.sequence = 0;
            }

            const signDoc = AminoMakeSignDoc(
                tx.msgs ? tx.msgs : [tx.msg],
                tx.fee,
                config.CHAIN_ID,
                tx.memo,
                account.accountNumber,
                account.sequence,
            );

            offlineSigner.signAmino(address, signDoc).then((result) => {
                if (result && result.code !== undefined && result.code !== 0) {
                    dispatch(signTxError(result.log || result.rawLog));
                } else {
                    dispatch(signTxSuccess(result));
                    cb(result);
                }
            }).catch((error) => {
                dispatch(signTxError(error && error.message));
            });
        } catch (e) {
            dispatch(signTxError(e && e.message));
        }
    })();
};

export const protoBufSigning = (tx, address, cb) => (dispatch) => {
    dispatch(signTxInProgress());
    (async () => {
        await window.keplr && window.keplr.enable(config.CHAIN_ID);
        const offlineSigner = window.getOfflineSigner && window.getOfflineSigner(config.CHAIN_ID);
        const myRegistry = new Registry([...defaultRegistryTypes, ...customRegistry]);
        if (tx && tx.fee && tx.fee.granter && window.keplr) {
            window.keplr.defaultOptions = {
                sign: {
                    disableBalanceCheck: true,
                },
            };
        } else if (window.keplr) {
            window.keplr.defaultOptions = {};
        }

        try {
            const client = await SigningStargateClient.connectWithSigner(
                config.RPC_URL,
                offlineSigner,
                { registry: myRegistry },
            );

            let account = {};
            try {
                account = await client.getAccount(address);
            } catch (e) {
                account.accountNumber = 0;
                account.sequence = 0;
            }
            const accounts = await offlineSigner.getAccounts();

            let pubkey = accounts && accounts.length && accounts[0] &&
                accounts[0].pubkey && encodeSecp256k1Pubkey(accounts[0].pubkey);
            pubkey = accounts && accounts.length && accounts[0] &&
                accounts[0].pubkey && pubkey && pubkey.value &&
                encodePubkey(pubkey);

            let authInfo = {
                signerInfos: [{
                    publicKey: pubkey,
                    modeInfo: {
                        single: {
                            mode: 1,
                        },
                    },
                    sequence: account && account.sequence,
                }],
                fee: { ...tx.fee },
            };
            authInfo = AuthInfo.encode(AuthInfo.fromPartial(authInfo)).finish();

            let msgValue = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].value : tx.msg && tx.msg.value;
            msgValue = msgValue && convertToCamelCase(msgValue);
            let typeUrl = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].typeUrl : tx.msg && tx.msg.typeUrl;

            if (tx.msgType) {
                const type = customTypes[tx.msgType].type;
                typeUrl = customTypes[tx.msgType].typeUrl;
                msgValue = type.encode(type.fromPartial(msgValue)).finish();
            } else if (typeUrl === '/ibc.applications.transfer.v1.MsgTransfer') {
                msgValue = MsgTransfer.encode(MsgTransfer.fromPartial(msgValue)).finish();
            }

            let bodyBytes = {
                messages: [{
                    typeUrl: typeUrl,
                    value: msgValue,
                }],
                memo: tx.memo,
            };
            bodyBytes = TxBody.encode(TxBody.fromPartial(bodyBytes)).finish();

            const signDoc = makeSignDoc(
                bodyBytes,
                authInfo,
                config.CHAIN_ID,
                account && account.accountNumber,
            );

            offlineSigner.signDirect(address, signDoc).then((result) => {
                const txRaw = TxRaw.fromPartial({
                    bodyBytes: result.signed.bodyBytes,
                    authInfoBytes: result.signed.authInfoBytes,
                    signatures: [fromBase64(result.signature.signature)],
                });
                const txBytes = TxRaw.encode(txRaw).finish();
                if (result && result.code !== undefined && result.code !== 0) {
                    dispatch(signTxError(result.log || result.rawLog));
                } else {
                    dispatch(signTxSuccess(result));
                    cb(result, toBase64(txBytes));
                }
            }).catch((error) => {
                dispatch(signTxError(error && error.message));
            });
        } catch (e) {
            dispatch(signTxError(e && e.message));
        }
    })();
};

export const walletConnectSign = (connector, tx, address, cb) => (dispatch) => {
    dispatch(signTxInProgress());

    const url = urlFetchAccount(address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((response) => {
            const accountNumber = response && response.data && response.data.account && response.data.account.account_number;
            const sequence = response && response.data && response.data.account && response.data.account.sequence;
            dispatch(handleWalletConnectSign(accountNumber, sequence, connector, tx, address, cb));
        })
        .catch(() => {
            const accountNumber = 0;
            const sequence = 0;
            dispatch(handleWalletConnectSign(accountNumber, sequence, connector, tx, address, cb));
        });
};

const handleWalletConnectSign = (accountNumber, sequence, connector, tx, address, cb) => (dispatch) => {
    const signDoc = AminoMakeSignDoc(
        tx.msgs ? tx.msgs : [tx.msg],
        tx.fee,
        config.CHAIN_ID,
        tx.memo,
        accountNumber,
        sequence,
    );

    const request = {
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_sign_tx_v1',
        params: [config.CHAIN_ID, address, signDoc],
    };

    connector.sendCustomRequest(request)
        .then((result) => {
            const res = result && result.length && result[0];
            if (res && res.code !== undefined && res.code !== 0) {
                dispatch(signTxError(res.log || res.rawLog));
            } else {
                dispatch(signTxSuccess(res));
                cb(res);
            }
        }).catch((error) => {
            dispatch(signTxError(error && error.message));
            cb(null);
        });
};

export const ibcWalletConnectSign = (connector, IBCConfig, tx, address, cb) => (dispatch) => {
    dispatch(signTxInProgress());

    const url = urlFetchIBCAccount(IBCConfig.REST_URL, address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((response) => {
            const accountNumber = response && response.data && response.data.account && response.data.account.account_number;
            const sequence = response && response.data && response.data.account && response.data.account.sequence;
            dispatch(handleIbcWalletConnectSign(accountNumber, sequence, connector, IBCConfig, tx, address, cb));
        })
        .catch(() => {
            const accountNumber = 0;
            const sequence = 0;
            dispatch(handleIbcWalletConnectSign(accountNumber, sequence, connector, IBCConfig, tx, address, cb));
        });
};

const handleIbcWalletConnectSign = (accountNumber, sequence, connector, IBCConfig, tx, address, cb) => (dispatch) => {
    const signDoc = AminoMakeSignDoc(
        tx.msgs ? tx.msgs : [tx.msg],
        tx.fee,
        IBCConfig.CHAIN_ID,
        tx.memo,
        accountNumber,
        sequence,
    );

    const request = {
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_sign_tx_v1',
        params: [IBCConfig.CHAIN_ID, address, signDoc],
    };

    connector.sendCustomRequest(request)
        .then((result) => {
            const res = result && result.length && result[0];
            if (res && res.code !== undefined && res.code !== 0) {
                dispatch(signTxError(res.log || res.rawLog));
            } else {
                const signed = res && res.signed;
                let pubkey = res && res.signature && res.signature.pub_key;
                pubkey = pubkey && pubkey.value && encodePubkey(pubkey);

                let authInfo = {
                    signerInfos: [{
                        publicKey: pubkey,
                        modeInfo: {
                            single: {
                                mode: 127,
                            },
                        },
                        sequence: signed && signed.sequence,
                    }],
                    fee: {
                        amount: signed.fee && signed.fee.amount,
                        gasLimit: signed.fee && signed.fee.gas,
                    },
                };

                authInfo = AuthInfo.encode(AuthInfo.fromPartial(authInfo)).finish();
                let msgValue = signed.msgs ? signed.msgs && signed.msgs[0] && signed.msgs[0].value : signed.msg && signed.msg.value;
                msgValue = msgValue && convertToCamelCase(msgValue);
                let typeUrl = signed.msgs ? signed.msgs && signed.msgs[0] && signed.msgs[0].type : signed.msg && signed.msg.type;

                if (typeUrl === '/ibc.applications.transfer.v1.MsgTransfer' ||
                    typeUrl === 'cosmos-sdk/MsgTransfer') {
                    typeUrl = '/ibc.applications.transfer.v1.MsgTransfer';
                    msgValue = MsgTransfer.encode(MsgTransfer.fromPartial(msgValue)).finish();
                }

                let bodyBytes = {
                    messages: [{
                        typeUrl: typeUrl,
                        value: msgValue,
                    }],
                    memo: signed.memo,
                };
                bodyBytes = TxBody.encode(TxBody.fromPartial(bodyBytes)).finish();

                const txRaw = TxRaw.fromPartial({
                    bodyBytes: bodyBytes,
                    authInfoBytes: authInfo,
                    signatures: [fromBase64(res.signature.signature)],
                });

                const txBytes = TxRaw.encode(txRaw).finish();
                dispatch(signTxSuccess(res));
                cb(res, toBase64(txBytes));
            }
        }).catch((error) => {
            dispatch(signTxError(error && error.message));
            cb(null);
        });
};

const txSignAndBroadCastInProgress = () => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_IN_PROGRESS,
    };
};

const txSignAndBroadCastSuccess = (value, message, variant, hash, explorer) => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_SUCCESS,
        value,
        message,
        variant,
        hash,
        explorer,
    };
};

const txSignAndBroadCastError = (message) => {
    return {
        type: TX_SIGN_AND_BROAD_CAST_ERROR,
        message,
        variant: 'error',
    };
};

export const txSignAndBroadCast = (data, cb) => (dispatch) => {
    dispatch(txSignAndBroadCastInProgress());

    const url = config.REST_URL + '/cosmos/tx/v1beta1/txs';
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res.data && res.data.tx_response && (res.data.tx_response.code !== undefined) && (res.data.tx_response.code !== 0)) {
                dispatch(txSignAndBroadCastError(res.data.tx_response.logs && res.data.tx_response.logs.length
                    ? res.data.tx_response.logs
                    : res.data.tx_response.raw_log));
                cb(null);
            } else {
                const message = 'Transaction Success, Waiting for the tx to be included in block';
                dispatch(txSignAndBroadCastSuccess(res.data && res.data.tx_response, message, 'processing',
                    res.data && res.data.tx_response && res.data.tx_response.txhash));
                cb(res.data && res.data.tx_response);
            }
        })
        .catch((error) => {
            dispatch(txSignAndBroadCastError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const txSignAndBroadCastAminoSign = (data, cb) => (dispatch) => {
    dispatch(txSignAndBroadCastInProgress());

    const url = config.REST_URL + '/txs';
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res.data && res.data.code !== undefined && (res.data.code !== 0)) {
                dispatch(txSignAndBroadCastError(res.data.logs || res.data.raw_log));
                cb(null);
            } else {
                const message = 'Transaction Success, Waiting for the tx to be included in block';
                dispatch(txSignAndBroadCastSuccess(res.data, message, 'processing',
                    res.data && res.data.txhash));
                cb(res.data);
            }
        })
        .catch((error) => {
            dispatch(txSignAndBroadCastError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

export const ibcTxSignAndBroadCast = (data, ibcConfig, explorer, cb) => (dispatch) => {
    dispatch(txSignAndBroadCastInProgress());

    const url = ibcConfig.REST_URL + '/cosmos/tx/v1beta1/txs';
    Axios.post(url, data, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res.data && res.data.tx_response && (res.data.tx_response.code !== undefined) && (res.data.tx_response.code !== 0)) {
                dispatch(txSignAndBroadCastError(res.data.tx_response.logs && res.data.tx_response.logs.length
                    ? res.data.tx_response.logs
                    : res.data.tx_response.raw_log));
                cb(null);
            } else {
                const message = 'Transaction Success, Waiting for the tx to be included in block';
                dispatch(txSignAndBroadCastSuccess(res.data && res.data.tx_response, message, 'processing',
                    res.data && res.data.tx_response && res.data.tx_response.txhash, explorer || EXPLORER_URL));
                cb(res.data && res.data.tx_response);
            }
        })
        .catch((error) => {
            dispatch(txSignAndBroadCastError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
            cb(null);
        });
};

const fetchTxHashInProgress = () => {
    return {
        type: TX_HASH_FETCH_IN_PROGRESS,
    };
};

const fetchTxHashSuccess = (message, hash) => {
    return {
        type: TX_HASH_FETCH_SUCCESS,
        message,
        variant: 'success',
        hash,
    };
};

const fetchTxHashError = () => {
    return {
        type: TX_HASH_FETCH_ERROR,
    };
};

export const fetchTxHash = (hash, cb) => (dispatch) => {
    dispatch(fetchTxHashInProgress());

    const url = config.REST_URL + '/txs/' + hash;
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((res) => {
            if (res.data && res.data.code !== undefined && res.data.code !== 0) {
                dispatch(fetchTxHashError(res.data.logs || res.data.raw_log));
                cb(res.data);
            } else {
                dispatch(fetchTxHashSuccess('Success', hash));
                cb(res.data);
            }
        })
        .catch((error) => {
            dispatch(fetchTxHashError(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : error.response &&
                    error.response.data &&
                    error.response.data.error
                        ? error.response.data.error
                        : 'Failed!',
            ));
            cb(null);
        });
};

export const setTxHashInProgressFalse = () => {
    return {
        type: TX_HASH_IN_PROGRESS_FALSE_SET,
    };
};

export const gasEstimation = (tx, pubKey, address, IBCConfig, protoType, cb) => (dispatch) => {
    dispatch(signTxInProgress());

    const url = urlFetchIBCAccount((IBCConfig && IBCConfig.REST_URL) || config.REST_URL, address);
    Axios.get(url, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    }).then((response) => {
        const sequence = response && response.data && response.data.account && response.data.account.sequence;
        dispatch(handleGasEstimation(sequence, tx, pubKey, address, IBCConfig, protoType, cb));
    }).catch(() => {
        const sequence = 0;
        dispatch(handleGasEstimation(sequence, tx, pubKey, address, IBCConfig, protoType, cb));
    });
};

const handleGasEstimation = (sequence, tx, pubKey, address, IBCConfig, protoType, cb) => (dispatch) => {
    let pubkey = pubKey && encodeSecp256k1Pubkey(pubKey);
    pubkey = pubkey && pubkey.value && encodePubkey(pubkey);

    let authInfo = {
        signerInfos: [{
            publicKey: pubkey,
            modeInfo: {
                single: {
                    mode: 0,
                },
            },
            sequence: sequence,
        }],
        fee: {
            amount: tx.fee && tx.fee.amount,
            gasLimit: tx.fee && tx.fee.gas,
        },
    };

    authInfo = AuthInfo.encode(AuthInfo.fromPartial(authInfo)).finish();
    let msgValue = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].value : tx.msg && tx.msg.value;
    msgValue = msgValue && convertToCamelCase(msgValue);
    let typeUrl = tx.msgs ? tx.msgs && tx.msgs[0] && tx.msgs[0].type : tx.msg && tx.msg.type;

    if (protoType) {
        const type = customTypes[protoType].type;
        typeUrl = customTypes[protoType].typeUrl;
        msgValue = type.encode(type.fromPartial(msgValue)).finish();
    } else if (typeUrl === '/ibc.applications.transfer.v1.MsgTransfer' ||
        typeUrl === 'cosmos-sdk/MsgTransfer') {
        typeUrl = '/ibc.applications.transfer.v1.MsgTransfer';
        msgValue = MsgTransfer.encode(MsgTransfer.fromPartial(msgValue)).finish();
    }

    let bodyBytes = {
        messages: [{
            typeUrl: typeUrl,
            value: msgValue,
        }],
        memo: tx.memo,
    };
    bodyBytes = TxBody.encode(TxBody.fromPartial(bodyBytes)).finish();

    const txRaw = TxRaw.fromPartial({
        bodyBytes: bodyBytes,
        authInfoBytes: authInfo,
        signatures: [new Uint8Array()],
    });

    const txBytes = TxRaw.encode(txRaw).finish();

    const simulateUrl = urlFetchSimulate((IBCConfig && IBCConfig.REST_URL) || config.REST_URL);
    Axios.post(simulateUrl, {
        tx_bytes: toBase64(txBytes),
    }, {
        headers: {
            Accept: 'application/json, text/plain, */*',
        },
    })
        .then((response) => {
            cb(response && response.data && response.data.gas_info);
        }).catch(() => {
            cb(null);
        });
};
