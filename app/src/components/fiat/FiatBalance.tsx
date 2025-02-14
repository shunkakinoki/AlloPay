import { Address } from 'lib';
import { useTokenValues } from '@token/useTokenValues';
import { FiatValue } from './FiatValue';

export interface FiatBalanceProps {
  addr?: Address;
  showZero?: boolean;
  rightAffix?: React.ReactNode;
}

export const FiatBalance = ({
  addr,
  showZero,
  rightAffix,
}: FiatBalanceProps) => {
  const { totalFiatValue } = useTokenValues(addr);

  if (!showZero && !totalFiatValue) return null;

  return (
    <>
      <FiatValue value={totalFiatValue} />
      {rightAffix}
    </>
  );
};
