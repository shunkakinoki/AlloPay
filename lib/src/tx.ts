import {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import { BigNumber, Contract, ethers } from 'ethers';
import {
  hexDataLength,
  hexlify,
  isBytesLike,
  randomBytes,
} from 'ethers/lib/utils';
import { address, Address, isAddress } from './addr';
import { zeroHexBytes } from './bytes';
import { Call, CallDef, createCall } from './call';
import { Id, toId } from './id';
import { createIsObj } from './util/mappedTypes';

export interface TxReq extends Call {
  salt: TxSalt;
}

export const isCall = createIsObj<Call>(
  ['to', isAddress],
  ['value', BigNumber.isBigNumber],
  ['data', isBytesLike],
);

const isTxReqExtras = createIsObj<TxReq>(['salt', isBytesLike]);
export const isTxReq = (e: unknown): e is TxReq =>
  isCall(e) && isTxReqExtras(e);

export const TX_EIP712_TYPE: Record<string, TypedDataField[]> = {
  Tx: [
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'salt', type: 'bytes8' },
  ],
};

export const getDomain = async (
  verifyingContract: Address | Contract,
): Promise<TypedDataDomain> => ({
  // chainId: (await contract.provider.getNetwork()).chainId,
  chainId: 0, // ZKSYNC: block.chainid always returns 0 - https://v2-docs.zksync.io/dev/zksync-v2/temp-limits.html#unsupported-opcodes
  verifyingContract:
    typeof verifyingContract === 'string'
      ? verifyingContract
      : verifyingContract.address,
});

export const hashTx = async (account: Address | Contract, tx: TxReq) =>
  ethers.utils._TypedDataEncoder.hash(
    await getDomain(account),
    TX_EIP712_TYPE,
    tx,
  );

export type TxSalt = string & { isTxSalt: true };
const TX_SALT_BYTES = 8;

export const randomTxSalt = (): TxSalt =>
  hexlify(randomBytes(TX_SALT_BYTES)) as TxSalt;

export const toTxSalt = (v: string): TxSalt => {
  if (hexDataLength(v) !== TX_SALT_BYTES)
    throw new Error('Invalid tx salt: ' + v);

  return v as TxSalt;
};

export const ZERO_TX_SALT = zeroHexBytes(TX_SALT_BYTES) as TxSalt;

export interface TxDef extends CallDef {
  salt?: TxSalt;
}

export const createTx = (tx: TxDef): TxReq => ({
  ...createCall(tx),
  salt: tx.salt || randomTxSalt(),
});

export const getTxId = (account: string, txHash: string): Id =>
  toId(`${account}-${txHash}`);

export const getTxIdParts = (id: Id) => {
  const [account, hash] = id.split('-');

  return {
    account: address(account),
    hash,
  };
};
