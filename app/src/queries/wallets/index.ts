import assert from 'assert';
import {
  WalletRef,
  Address,
  createIsObj,
  Id,
  Quorum,
  Wallet,
  sortQuorums,
  quorumToLeaf,
} from 'lib';
import { TxId } from '../tx';

export const QUERY_WALLETS_POLL_INTERVAL = 30 * 1000;

export type ProposableStatus = 'active' | 'add' | 'remove';

export interface ProposableState {
  status: ProposableStatus;
  proposedModification?: TxId;
}

export interface CombinedQuorum {
  approvers: Quorum;
  state: ProposableState;
}

export const isCombinedQuorum = createIsObj<CombinedQuorum>(
  'approvers',
  'state',
);

export const sortCombinedQuorums = (
  quorums: CombinedQuorum[],
): CombinedQuorum[] =>
  quorums
    .map((q) => ({ q, leaf: quorumToLeaf(q.approvers) }))
    .sort((a, b) => Buffer.compare(a.leaf, b.leaf))
    .map(({ q }) => q);

export interface WalletId {
  id: Id;
  accountAddr: Address;
  ref: WalletRef;
}

export interface CombinedWallet extends WalletId {
  name: string;
  quorums: CombinedQuorum[];
  state: ProposableState;
}

export const toSafeWallet = (
  w: Pick<CombinedWallet, 'ref' | 'quorums'>,
): Wallet => ({
  ref: w.ref,
  quorums: sortQuorums(
    w.quorums
      .filter((q) => q.state.status !== 'remove')
      .map((q) => q.approvers),
  ),
});

export const toActiveWallet = (
  w: Pick<CombinedWallet, 'ref' | 'quorums' | 'state'>,
): Wallet => {
  assert(w.state.status === 'active');

  return {
    ref: w.ref,
    quorums: sortQuorums(
      w.quorums.filter((q) => q.state.status !== 'add').map((q) => q.approvers),
    ),
  };
};
