import { useMemo } from 'react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { FormatNumberOptions, useIntl } from 'react-intl';

export interface FormattedValueProps extends FormatNumberOptions {
  value: BigNumberish;
  unitDecimals?: number;
  extendedFractionDigits?: number;
  postFormat?: (value: string) => string;
}

export const FormattedNumber = ({
  value,
  unitDecimals,
  maximumFractionDigits = 2,
  extendedFractionDigits,
  postFormat,
  ...formatOpts
}: FormattedValueProps) => {
  const intl = useIntl();

  const extendedFracDigits = extendedFractionDigits ?? maximumFractionDigits;
  const extendedMin = 1 / 10 ** extendedFracDigits;
  const maxMin = 1 / 10 ** maximumFractionDigits;

  const formatted = useMemo(() => {
    let v = value;
    if (BigNumber.isBigNumber(v)) v = ethers.utils.formatUnits(v, unitDecimals);

    if (typeof v === 'string') v = parseFloat(v);
    if (typeof v !== 'number') v = BigNumber.from(v).toNumber();

    const isLt = v < extendedMin && v > 0;
    if (isLt) v = extendedMin;

    let formatted = intl.formatNumber(v, {
      maximumFractionDigits:
        v < maxMin ? extendedFracDigits : maximumFractionDigits,
      ...formatOpts,
    });

    if (postFormat) formatted = postFormat(formatted);

    return isLt ? `< ${formatted}` : formatted;
  }, [
    value,
    unitDecimals,
    extendedMin,
    intl,
    maxMin,
    extendedFracDigits,
    maximumFractionDigits,
    formatOpts,
    postFormat,
  ]);

  return <>{formatted}</>;
};
