import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState } from 'react';
import { toastFail, toastSuccess } from '../../../utils/toast';

export default () => {
  const [loading, setLoading] = useState(false);

  const {
    account, connected, connect, disconnect,
  } = useWallet();

  const handleConnect = async (walletName) => {
    try {
      setLoading(true);
      await connect(walletName);
      toastSuccess();
    } catch (error) {
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toastSuccess();
    } catch (error) {
      toastFail();
    }
  };

  return {
    loading, account, handleConnect, handleDisconnect, connected,
  };
};
