import { useEffect, useState } from 'react';

export default () => {
  const [chainId, setChainId] = useState('');
  const [network, setNetwork] = useState('');

  const getNetwork = () => {
    Promise.all([
      ethereum.request({ method: 'eth_chainId' }),
      ethereum.request({ method: 'net_version' }),
    ]).then((resp) => {
      setChainId(resp[0]);
      setNetwork(resp[1]);
    });
  };
  useEffect(() => {
    getNetwork();
    ethereum.on('chainChanged', () => {
      getNetwork();
    });
  }, []);

  return { chainId, network };
};
