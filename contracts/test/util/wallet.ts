import * as hre from 'hardhat';
import * as zk from 'zksync-web3';
import CONFIG from 'config';
import localWallets from '../../local-wallets.json';
import { address, Device } from 'lib';

export const provider = new zk.Provider(hre.config.zkSyncDeploy.zkSyncNetwork);

export const allSigners = localWallets.map(
  (w) => new Device(w.privateKey, provider),
);

export const device =
  CONFIG.chain.name === 'local'
    ? allSigners[0]
    : new Device(CONFIG.wallet.privateKey!, provider);

export const USDC = address('0x54a14D7559BAF2C8e8Fa504E019d32479739018c');
