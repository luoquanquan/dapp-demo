import { useWallet } from '@aptos-labs/wallet-adapter-react';

function AptosWallet({ children }) {
  const {
    connect,
    account,
    network,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signAndSubmitBCSTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
  } = useWallet();

  console.log('AptosWallet - wallets available: ', wallets);

  console.log('AptosWallet - useWallet: ', {
    connect,
    account,
    network,
    connected,
    disconnect,
    wallet,
    signAndSubmitTransaction,
    signAndSubmitBCSTransaction,
    signTransaction,
    signMessage,
    signMessageAndVerify,
  });

  return (
    <>
      {children({
        connect,
        account,
        network,
        connected,
        disconnect,
        wallet,
        wallets,
        signAndSubmitTransaction,
        signAndSubmitBCSTransaction,
        signTransaction,
        signMessage,
        signMessageAndVerify,
      })}
    </>
  );
}

export default AptosWallet;
