import { BytesLike, ethers, Signer } from 'ethers';
import { Address, address, Addresslike } from './addr';
import {
  Account,
  Factory,
  Factory__factory,
  Account__factory,
  ERC1967Proxy__factory,
} from './contracts';
import { Wallet } from './wallet';
import {
  defaultAbiCoder,
  hexDataLength,
  hexlify,
  randomBytes,
} from 'ethers/lib/utils';
import * as zk from 'zksync-web3';

export type DeploySalt = string & { isDeploySalt: true };
const DEPLOY_SALT_BYTES = 32;

export const toDeploySalt = (v: string): DeploySalt => {
  if (hexDataLength(v) !== DEPLOY_SALT_BYTES)
    throw new Error('Invalid deploy salt: ' + v);

  return v as DeploySalt;
};

export const randomDeploySalt = () =>
  hexlify(randomBytes(DEPLOY_SALT_BYTES)) as DeploySalt;

const createConnect =
  <T>(f: (addr: string, signer: Signer | ethers.providers.Provider) => T) =>
  (addr: Addresslike, signer: Signer | ethers.providers.Provider): T =>
    f(address(addr), signer);

export const connectFactory = createConnect(Factory__factory.connect);
export const connectAccount = createConnect(Account__factory.connect);
export const connectProxy = createConnect(ERC1967Proxy__factory.connect);

export interface AccountConstructorArgs {
  wallet: Wallet;
}

export interface ProxyConstructorArgs extends AccountConstructorArgs {
  impl: Address;
}

export const encodeProxyConstructorArgs = ({
  wallet,
  impl,
}: ProxyConstructorArgs) => {
  const accountInterface = Account__factory.createInterface();
  const encodedInitializeCall = accountInterface.encodeFunctionData(
    'initialize',
    [wallet.ref, wallet.quorums],
  );

  return defaultAbiCoder.encode(
    // constructor(address _logic, bytes memory _data)
    ['address', 'bytes'],
    [impl, encodedInitializeCall],
  );
};

export const calculateProxyAddress = async (
  args: ProxyConstructorArgs,
  factory: Factory,
  salt: BytesLike,
) => {
  const addr = zk.utils.create2Address(
    factory.address,
    await factory._BYTECODE_HASH(),
    salt,
    encodeProxyConstructorArgs(args),
  );

  return address(addr);
};

export const deployAccountProxy = async (
  args: ProxyConstructorArgs,
  factory: Factory,
  salt = randomDeploySalt(),
) => {
  const addr = await calculateProxyAddress(args, factory, salt);

  const encodedConstructorData = encodeProxyConstructorArgs(args);
  const deployTx = await factory.deploy(salt, encodedConstructorData);
  await deployTx.wait();

  return {
    proxy: connectProxy(addr, factory.signer),
    account: connectAccount(addr, factory.signer),
    salt,
    deployTx,
  };
};

export const isDeployed = async (account: Account) =>
  (await account.provider.getCode(account.address)) !== '0x';
