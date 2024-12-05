import { useEffect, useState } from 'react';

export default (provider) => {
  const [chainId, setChainId] = useState('');

  const getNetwork = () => {
    provider?.request
      && provider.request({ method: 'eth_chainId' }).then((resp) => {
        setChainId(resp);
      });
  };
  useEffect(() => {
    if (provider) {
      getNetwork();

      provider?.on
        && provider.on('chainChanged', () => {
          console.log('chainChanged');
          getNetwork();
        });
    }
  }, [provider]);

  return { chainId };
};
