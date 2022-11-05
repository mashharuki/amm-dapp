import { BigNumber } from "ethers";

// share
export const formatWithPrecision = (
  share: string,
  precision: BigNumber
): BigNumber => {
  return BigNumber.from(share).mul(precision);
};

// share
export const formatWithoutPrecision = (
  share: BigNumber,
  precision: BigNumber
): string => {
  return share.div(precision).toString();
};