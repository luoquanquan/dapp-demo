import { useEffect, useState } from 'react';

export default () => {
  const { ethereum } = window;
  const [chainId, setChainId] = useState('');

  const getNetwork = () => {
    Promise.all([
      ethereum.request({ method: 'eth_chainId' }),
    ]).then((resp) => {
      setChainId(+resp[0]);
    });
  };
  useEffect(() => {
    if (ethereum) {
      getNetwork();
      ethereum.on('chainChanged', () => {
        getNetwork();
      });
    }
  }, []);

  return { chainId };
};
