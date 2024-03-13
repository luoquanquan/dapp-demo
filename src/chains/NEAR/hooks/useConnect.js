import { message } from 'antd';
import { useEffect, useState } from 'react';
import { wNearContractId } from '../const';

const defaultAccessOld_dae = {
  secretKey: 'EdhQjQE1bsn7PPBWkCVGN4QjuVJrNchPx7HpQkbnYBrtQTMwyW6FcVGQcP41wusoXft1WaLLL2TbpiSfvJytHVN',
  publicKey: 'ed25519:8UAfi6BEikudmkSNm7qzvxHZCXMSSGxxyjfLj8p6oX1n',
};

const accessFull_dae = {
  secretKey: '69bYrD7HSMbUBV1N6dSAV57XYvsf9bj2YC8yJRBKyKD1vpQWL2wibWRWfsusAKdBQ2UjKKoko7sJpUs4rJdaeaD',
  publicKey: 'ed25519:3Vdyz54yGz8TfNc8jCXhRXpysNmjMtdLvWWYcRcAbQJm',
};

const defaultAccessFunc = {
  secretKey: 'FLZjGyNs3qn5i97mWKCvHewT7eGV8WR29gpFjevpWnLPfKHPf9vLYjQG9ffLkNfRHxPenEmRWeHpsQopXp4jxmo',
  publicKey: 'ed25519:BABtx9ocoZTzpy2X5UsbjS7gbDTU5f7tAAkGsvZa1Uyw',
};

const accessFull = {
  secretKey: 'Hk1GUm172WzGuT2SgSVvSmkoNsPzYVCQ78zoax1Jax31NfuLNCNknnwehrANwtbjZeaLWnqbchwUnAVHs5Gbd4h',
  publicKey: 'ed25519:25CziWQepqvoyxZbTD1zvZiFM6wBzTsp13uofp8RRY7F',
};

export default () => {
  const [loading, setLoading] = useState(false);
  // 连接钱包
  const [account, setAccount] = useState('');
  const [access, setAccess] = useState(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await window.near.requestSignIn({
        contractId: '',
        methodNames: [],
      });

      setAccount(window.near.getAccountId());
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWithContractId = async () => {
    try {
      setLoading(true);
      const { accessKey } = await window.near.requestSignIn({
        contractId: wNearContractId,
        methodNames: [],
      });
      console.log('Current log: accessKey: ', accessKey);
      setAccount(window.near.getAccountId());
      setAccess(accessKey);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisConnect = () => {
    window.near.signOut();
    setAccount('');
    setAccess(null);
  };

  useEffect(() => {
    try {
      window.near.on('accountChanged', handleConnect);
      window.near.on('signOut', (() => {
        console.log('Current log: signOut');
      }));
      window.near.on('signIn', (() => {
        console.log('Current log: signIn');
      }));

      handleConnect();
    } catch (error) {
      console.log('Current log: error: ', error);
    }
  }, []);

  return {
    loading, account, access, handleDisConnect, handleConnect, handleConnectWithContractId,
  };
};
