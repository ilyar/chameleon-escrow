import 'dotenv/config'
import { Config } from '@ton/blueprint';

export const config: Config = {
    network: {
        endpoint: process.env.TONCENTER_ENDPOINT ?? 'https://toncenter.com/api/v3/jsonRPC',
        // @ts-ignore
        type: process.env.TONCENTER_TYPE ?? 'testnet',
        // @ts-ignore
        version: process.env.TONCENTER_VERSION ?? 'v3',
        key: process.env.TONCENTER_KEY,
    },
};


