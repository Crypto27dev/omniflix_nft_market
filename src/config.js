import flixIcon from './assets/tokens/flix.svg';
import spayIcon from './assets/tokens/spay.svg';

export const config = {
    API_URL: 'https://staging-api.omniflix.studio',
    RPC_URL: 'https://rpc.flixnet-4.omniflix.network',
    REST_URL: 'https://rest.flixnet-4.omniflix.network',
    DATA_LAYER: 'https://data-layer-f4.omniflix.studio',
    FAUCET_URL: 'https://api.testnet-faucet.omniflix.network',
    CHAIN_ID: 'flixnet-4',
    CHAIN_NAME: 'OmniFlix FlixNet-4',
    COIN_DENOM: 'FLIX',
    COIN_MINIMAL_DENOM: 'uflix',
    COIN_DECIMALS: 6,
    PREFIX: 'omniflix',
    AVG_GAS_STEP: 0.005,
};

export const ACTIVITY_URL = 'https://activity-api-flixnet.omniflix.studio';
export const EXPLORER_URL = 'https://f4.omniflix.prithvidevs.in';
export const IPFS_URL = 'https://ipfs.omniflix.studio/ipfs';
export const STUDIO_URL = 'https://f4.omniflix.studio';
export const DEFAULT_SKIP = 0;
export const DEFAULT_LIMIT = 20;
export const DEFAULT_TOTAL = 20;
export const DEFAULT_SORT_BY = 'created_at';
export const DEFAULT_ORDER = 'desc';
export const DEFAULT_LAZY_FETCH_HEIGHT = 256;
export const TRANSACTION_SET_TIME_OUT = 3000;

export const chainId = config.CHAIN_ID;
export const chainName = config.CHAIN_NAME;
export const coinDenom = config.COIN_DENOM;
export const coinMinimalDenom = config.COIN_MINIMAL_DENOM;
export const coinDecimals = config.COIN_DECIMALS;
export const prefix = config.PREFIX;

export const socialLinks = {
    TWITTER: 'https://twitter.com/OmniFlixNetwork',
    TELEGRAM: 'https://t.me/OmniFlixChat',
    DISCORD: 'https://discord.com/invite/6gdQ4yZSTC',
    GITHUB: 'https://github.com/OmniFlix',
    WEBSITE: 'https://omniflix.network/',
    YOUTUBE: 'https://www.youtube.com/OmniFlixNetwork',
};

export const appsLinks = {
    STUDIO: STUDIO_URL,
    IN_SYNC: 'https://omniflix.co',
    TV: 'https://alpha.omniflix.tv',
};

export const chainConfig = {
    chainId: chainId,
    chainName,
    rpc: config.RPC_URL,
    rest: config.REST_URL,
    stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
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
    currencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
        },
    ],
    feeCurrencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            gasPriceStep: {
                low: 0.001,
                average: 0.0025,
                high: 0.025,
            },
        },
    ],
    coinType: 118,
    features: ['ibc-transfer'],
};

export const FaucetList = [{
    name: config.COIN_DENOM,
    chain_id: config.CHAIN_ID,
    chain: 'omniflix-flixnet',
    icon: flixIcon,
    denom: config.COIN_MINIMAL_DENOM,
}, {
    name: 'SPAY',
    chain_id: 'streampay-1',
    chain: 'streampay-testnet',
    icon: spayIcon,
    denom: 'ibc/B7D9A80638CBDD58E46C5769C8E5FAD35A4A83C30AF817885FC8AAE31F4C63B9',
    network: {
        address_prefix: 'streampay',
        api_address: 'https://rest.streampay.omniflix.network',
        chain_id: 'streampay-1',
        decimals: 6,
        denom: 'uspay',
        display_denom: 'SPAY',
        name: 'Stream Pay',
        rpc_address: 'https://rpc.streampay.omniflix.network',
    },
}];
