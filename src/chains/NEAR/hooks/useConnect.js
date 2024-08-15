import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { wNearContractId } from '../const';

const connectTypeMap = {
  origin: 'origin',
  walletSelector: 'walletSelector',
};

export default () => {
  const [loading, setLoading] = useState(false);
  const providerRef = useRef();
  // 连接钱包
  const [account, setAccount] = useState('');
  const [access, setAccess] = useState(null);
  const [connectType, setConnectType] = useState('');

  const handleConnect = async () => {
    try {
      setLoading(true);
      await window.near.requestSignIn({
        contractId: '',
        methodNames: [],
      });

      setAccount(window.near.getAccountId());
      providerRef.current = window.near;
      setConnectType(connectTypeMap.origin);
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
      setAccount(window.near.getAccountId());
      setAccess(accessKey);
      providerRef.current = window.near;
      setConnectType(connectTypeMap.origin);
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
      if (providerRef.current) {
        providerRef.current.on('accountChanged', (msg) => {
          console.log('Current log: msg: ', msg);
        });
        providerRef.current.on('signOut', ((msg) => {
          console.log('Current log: msg: ', msg);
          console.log('Current log: signOut');
        }));
        providerRef.current.on('signIn', ((msg) => {
          console.log('Current log: msg: ', msg);
          console.log('Current log: signIn');
        }));
      }
    } catch (error) {
      console.log('Current log: error: ', error);
    }
  }, [account]);

  return {
    loading, account, access, provider: providerRef.current, connectType, handleDisConnect, handleConnect, handleConnectWithContractId,
  };
};
