import { useEffect, useState } from 'react';
import { Space, Button } from 'antd';
import { SafeArea, Tabs } from 'antd-mobile';
import {
  getSession,
  getUri,
  connectApp,
  connectTG,
  connect,
  getSdk,
  getProvider,
  SupportedNetworks,
  disconnect,
} from '@repo/connect-kit';
import { QRCodeSVG } from 'qrcode.react';
import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';
import NEAR from './chains/NEAR';
import ProjectInfo from './components/ProjectInfo';
import Ton from './chains/Ton';
import Sui from './chains/Sui';
import Aptos from './chains/Aptos';

const localTabKey = 'localTabKey';

const tabs = [Evm, Tron, Solana, NEAR, Ton, Sui, Aptos];

const cachedChainKey = localStorage.getItem(localTabKey);
const isValidDefaultActiveKey = tabs.some(({ key }) => cachedChainKey === key);
const defaultActiveKey = isValidDefaultActiveKey ? cachedChainKey : Evm.key;

export default function App() {
  const [connecting, setConnecting] = useState(false);
  const [uri, setUri] = useState('');
  useEffect(() => {
    const sdk = getSdk();
    console.log('session: ', getSession());
    const provider = getProvider(SupportedNetworks.ETHEREUM);
    console.log('sdk: ', sdk);
    console.log('provider: ', provider);
    provider?.on &&
      provider.on('connect', (data) => {
        console.log('provider connect: ', data);
      });

    console.log('subscribe sdk connect');
    sdk?.on &&
      sdk.on('connect', (session) => {
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

    // for testing only
    window.okxConnectSdk = sdk;
  }, []);

  const onClickGetUri = async () => {
    const sdk = getSdk();
    sdk.once('session_connecting', () => {
      setConnecting(true);
      console.log('session_connecting');
    });
    sdk.once('connect', () => {
      setConnecting(false);
      console.log('sdk connect and remove listener');
    });
    sdk.once('connect_error', () => {
      setConnecting(false);
      console.log('dapppp connect_error');
    });
    const newUri = await getUri();
    setUri(newUri);

    console.log('get display uri for QR code scan: ', uri);
  };
  return (
    <Space direction="vertical" className="wrap">
      <SafeArea position="top" />
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
      <Button onClick={connectApp}>Connect Mobile App</Button>
      <Button onClick={connectTG}>Connect TG</Button>
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        onChange={(target) => {
          localStorage.setItem(localTabKey, target);
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Tab title={tab.key} key={tab.key}>
            {tab.children}
          </Tabs.Tab>
        ))}
      </Tabs>
      <ProjectInfo />
      <SafeArea position="bottom" />
    </Space>
  );
}
