import React, { useEffect, useState } from 'react';
import { Space, Button, message } from 'antd';
import { SafeArea } from 'antd-mobile';

import {
  getSession,
  getUri,
  connectOKXAppWallet,
  connectOKXMiniWallet,
  connect,
  getConnectKit,
  getProvider,
  SupportedNetworks,
  disconnect,
  restoreTGParam,
  getAllAddresses,
  ConnectKitErrorCodes,
} from '@repo/connect-kit';
import { QRCodeSVG } from 'qrcode.react';

function Connect() {
  const [connecting, setConnecting] = useState(false);
  const [uri, setUri] = useState('');
  useEffect(() => {
    const sdk = getConnectKit();
    console.log('session: ', getSession());
    const provider = getProvider(SupportedNetworks.ETHEREUM);
    console.log('sdk: ', sdk);
    console.log('provider: ', provider);
    provider?.on
      && provider.on('connect', (data) => {
        console.log('provider connect: ', data);
      });

    console.log('subscribe sdk connect');
    sdk?.on
      && sdk.on('connect', (session) => {
        console.log('sdk connect - session: ', session);

        // sdk.request
        if (sdk.request) {
          const request = async () => {
            try {
              const accounts = await sdk.request(
                { method: 'eth_accounts' },
                SupportedNetworks.ETHEREUM,
              );
              console.log('accounts: ', accounts);
            } catch (err) {
              console.log('err: ', err);
            }
          };
          request();
        }
      });
    sdk.on('connect_error', (e) => {
      console.log('dapppp connect_error:', e);
    });
    // for testing only
    window.okxConnectSdk = sdk;
    // For syncAllAddresses & connectAndSign, https://applink.larksuite.com/client/message/link/open?token=AmdIZNS2wAAMZ1JzxNBAQAY%3D
    window.okxGlobal = 1;
  }, []);

  const onClickGetUri = async () => {
    const sdk = getConnectKit();
    sdk.once('session_connecting', () => {
      setConnecting(true);
      console.log('session_connecting');
    });
    sdk.once('connect', async () => {
      setConnecting(false);
      console.log('sdk connect and remove listener');
      const allAddresses = await getAllAddresses();
      console.log('SDK connected - allAddresses: ', allAddresses);
    });
    sdk.once('connect_error', () => {
      setConnecting(false);
      console.log('dapppp connect_error');
    });
    const newUri = await getUri();
    setUri(newUri);

    console.log('get display uri for QR code scan: ', uri);
  };

  const handleConnectMobileApp = async () => {
    try {
      const session = await connectOKXAppWallet();
      console.log('mobile app connected - session: ', session);
      const allAddresses = await getAllAddresses();
      console.log('mobile app connected - allAddresses: ', allAddresses);
    } catch (err) {
      console.log('connect mobile app error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to connect mobile app');
      }
    }
  };

  const handleConnectMiniWallet = async () => {
    try {
      const session = await connectOKXMiniWallet();
      console.log('mini wallet connected - session: ', session);
      const allAddresses = await getAllAddresses();
      console.log('mini wallet connected - allAddresses: ', allAddresses);
    } catch (err) {
      console.log('connect mini wallet error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to connect mini wallet');
      }
    }
  };

  const jumpToAnother = () => {
    window.location.href = 'https://sherlockhomer.github.io/dapp-demo-local/';
  };

  const jumpToAnotherWithHash = () => {
    window.location.href = `https://sherlockhomer.github.io/dapp-demo-local/#${window.location.hash}`;
  };
  const swap = () => {
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          data: '0x0d5f0e3b000000000032caf58228b6c0d40515d9a6521b579491db5b4c295069f2049d4000000000000000000000000000000000000000000000000000000000041d39520000000000000000000000000000000000000000000000000000000004181bd9000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000018000000000000000000000003416cf6c708da44db2624d63ea0aaef7113527c6',
          from: '0xd40515d9a6521b579491db5b4c295069f2049d40',
          to: '0xf3de3c0d654fda23dad170f0f320a92172509127',
          value: '0x0',
          extParams: {
            txSource: 3,
            orderId: '14296904635037376',
            toTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            crossChain: 0,
            chainId: 1,
            tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            amount: '69.024082',
            toChainId: 1,
          },
        },
      ],
    });
  };

  return (
    <Space direction="vertical" className="wrap">
      <SafeArea position="top" />
      <Button onClick={jumpToAnother}>jump to another dapp</Button>
      <Button onClick={jumpToAnotherWithHash}>
        jump to another dapp with hash
      </Button>
      <a href="https://sherlockhomer.github.io/dapp-demo-local">
        a to dapp-demo-local
      </a>
      <Button onClick={restoreTGParam}>restoreTGParam</Button>
      <Button onClick={swap}>SWAP</Button>
      <Button onClick={onClickGetUri}>
        {connecting ? 'connecting' : 'Get Uri'}
      </Button>
      {uri ? (
        <QRCodeSVG
          style={{ marginLeft: '20px' }}
          value={uri}
          fgColor={connecting ? '#bbb' : ''}
        />
      ) : null}
      <Button onClick={handleConnectMobileApp}>Connect Mobile App</Button>
      <Button onClick={handleConnectMiniWallet}>Connect TG</Button>
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
      <Button onClick={getAllAddresses}>Get all addresses</Button>
    </Space>
  );
}

export default {
  key: 'Connect',
  children: <Connect />,
};
