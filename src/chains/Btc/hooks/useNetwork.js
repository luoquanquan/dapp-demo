import { useState, useEffect } from 'react';

export default (provider) => {
  const [chain, setChain] = useState('');

  const getNetwork = async () => {
    console.log('getNetwork - onConnect');
    const chainId = await provider.getNetwork();
    console.log('getNetwork - onConnect: ', chainId);
    setChain(chainId);
  };

  useEffect(() => {
    if (!provider) return;
    console.log('useConnect: ', provider);
    if (!provider || !provider?.on) return;

    // subscribe to connect event
    provider.on('connect', getNetwork);

    getNetwork();
  }, [provider]);

  return {
    chain,
    getNetwork,
  };
};
