import { Token } from "@voltage-finance/sdk";

/*
 * What are these?
 *    WOLFE MIGLIO (WOLFE)
 *    UniBomb (UBOMB)
 *    ERC20
 *    BITCOIN FREE (BTCFR)
 */
export const TOKEN_DENY = [];

//Uniswap V2 (UNI-V2)
export const PAIR_DENY = [""];

export const EXCHANGE_CREATED_TIMESTAMP = 1599214239;

export const SUSHI_TOKEN = "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd";

// used to blacklist farms
export const FARMS_BLACKLIST = [
  "35", // JOEBORROW
  "36", // JOELDN
];

const ChainId = {
  FUSE: 122,
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42
}

export const VUSD1 = new Token(
  ChainId.FUSE,
  '0xa3c1046290B490e629E11AcE35863CB0CAe382aB',
  18,
  'vUSD1',
  'vUSD1 LP Token'
)

export const VUSD2 = new Token(
  ChainId.FUSE,
  '0xC71CAb88c1674A39A3e2841274E54e34D709Af91',
  18,
  'vUSD2',
  'vUSD2 LP Token'
)

export const FUSE_USDC = new Token(
  ChainId.FUSE,
  '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5',
  6,
  'USDC',
  'USD Coin on Fuse'
)
export const FUSE_USDT = new Token(
  ChainId.FUSE,
  '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10',
  6,
  'USDT',
  'Tether USD on Fuse'
)

export const FUSE_FUSD = new Token(
  ChainId.FUSE,
  '0x249BE57637D8B013Ad64785404b24aeBaE9B098B',
  18,
  'fUSD',
  'Fuse Dollar'
)

export const FUSE_BUSD = new Token(
  ChainId.FUSE,
  '0x6a5F6A8121592BeCd6747a38d67451B310F7f156',
  18,
  'BUSD',
  'Binance USD on Fuse'
)

export const FUSE_UST = new Token(
  ChainId.FUSE,
  '0x0D58a44be3dCA0aB449965dcc2c46932547Fea2f',
  18,
  'atUST',
  'UST Terra on Fuse'
)


export const STABLESWAP_POOLS = {
  '0x2a68D7C6Ea986fA06B2665d08b4D08F5e7aF960c': {
    name: 'vUSD1',
    address: '0x2a68D7C6Ea986fA06B2665d08b4D08F5e7aF960c',
    lpToken: VUSD1,
    tokenList: [FUSE_BUSD, FUSE_USDC, FUSE_USDT]
  },
  '0x83D158Beadbb3445AC901cFd0ca33FB30CCC8f53': {
    name: 'vUSD2',
    address: '0x83D158Beadbb3445AC901cFd0ca33FB30CCC8f53',
    lpToken: VUSD2,
    tokenList: [FUSE_FUSD, FUSE_USDT, FUSE_UST]
  }
}
