/* eslint-disable no-useless-concat */
export const myTronAddress = 'TNssWTZnEakY2fN2Aaa71k85yRqVcjcv69';
export const contractAddress = 'THRAE2VhGNAcvPKtT96AqyXtSQwhiU1XL8';
export const tronUSDTAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
export const tronUSDCAddress = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8';
export const tronNFTAddress = 'TDxkVPEaSNQkGb5HKmucMuLYbkZD3oWgUp';

// export const grayTronAddress = 'THoouS6UDEoGuZS1qJdf9x6nCmjMs4eZqV';
export const grayTronAddress = 'TGsjdoBWhdAWsdVnkrdayBGw2k4wi1DXaY';
export const tronStrongBlackEoaAddress = 'TUt6TJ2qLrcyWQN8XVLbEXEuy8qhnivj84';
export const mySolAddress = '4mpBfqutcvpfsF1xt6SAnqfFJcE1aGC1EjhcNRyoLSM8';
export const solanaUSDTAddress = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
export const openSeaAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
export const myAddress = '0xfe8dc6394501a35ad1c4833f40f382e55dada4f3';
export const myTonAddress = 'UQDOc7wK8x2Avyet0tUQ0j-6KqbhdRN7yKQGYtI5uYMI0Gxc';

export const getEvmBlackContractAddress = (chainId = 1) => {
  const addressMap = {
    // 1: '0xd422e603cad822de9ff2ec61a8491164f748585a',
    1: '0x458c761053bc46bc044bd7c9c68e58c5d44da45f',
    137: '0xd422e603cad822de9ff2ec61a8491164f748585a',
    66: '0xd422e603cad822de9ff2ec61a8491164f748585a',
  };

  return addressMap[chainId];
};

export const getEvmBlackEoaAddress = (chainId = 1) => {
  const addressMap = {
    1: '0xe72f67c80629BA1Af83ce3035AA8e10cED7007A7',
    137: '0xeb0647bfd3def182e7cbc5bc266cc81ceb83862d',
  };

  return addressMap[chainId];
};

export const getStrongBlackEoaAddress = (chainId = 1) => {
  const addressMap = {
    1: '0x411be70a215df02311d62f9a8cd201b38ae4effd',
    137: '0xde05fdad44c27365e4fbb91978dd778b4abd0575',
  };

  return addressMap[chainId];
};
