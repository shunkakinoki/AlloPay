import { persistAtom } from '~/util/effect/persistAtom';
import { Address } from 'lib';
import {
  atom,
  DefaultValue,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { Token } from '@token/token';
import { USDC } from '@token/tokens';
import { tokenSelector } from '@token/useToken';

const selectedTokenAddress = atom<Address>({
  key: 'lastTokenAddress',
  default: USDC.addr,
  effects: [persistAtom()],
});

const selectedToken = selector<Token>({
  key: 'lastToken',
  get: ({ get }) => {
    const addr = get(selectedTokenAddress);
    return get(tokenSelector(addr));
  },
  set: ({ set }, token) => {
    set(
      selectedTokenAddress,
      token instanceof DefaultValue ? token : token.addr,
    );
  },
});

export const useSelectedToken = () => useRecoilValue(selectedToken);

export const useSelectToken = () => useSetRecoilState(selectedToken);
