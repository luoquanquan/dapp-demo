/* eslint-disable no-useless-concat */
export const openSeaAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
export const myEvmAddress = '0xfe8dc6394501a35ad1c4833f40f382e55dada4f3';

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
    1: '0x300b6acb1851acd39104b99bbe540e02ed6eeec1',
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
