import { useEffect, useState } from 'react';

export default () => {
  const [chainId, setChainId] = useState('');

  const getNetwork = () => {
    Promise.all([
      ethereum.request({ method: 'eth_chainId' }),
    ]).then((resp) => {
      setChainId(resp[0]);
    });
  };
  useEffect(() => {
    getNetwork();
    ethereum.on('chainChanged', () => {
      getNetwork();
    });
  }, []);

  return { chainId };
};
