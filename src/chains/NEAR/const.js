import { toastFail, toastSuccess } from '../../utils/toast';

export const contractId = 'v2.ref-farming.near';
export const wNearContractId = 'wrap.near';
export const config = {
  network: 'mainnet',
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.mainnet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://nearblocks.io',
};

export const handleNearResp = (resp) => {
  console.log(resp);

  if (resp.error) {
    toastFail();
  } else {
    toastSuccess();
  }
};
