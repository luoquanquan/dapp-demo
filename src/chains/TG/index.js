import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react';

function TG() {
  return (
    <TonConnectUIProvider manifestUrl="https://app.ston.fi/tonconnect-manifest.json">
      <span>My App with React UI</span>
      <TonConnectButton />
    </TonConnectUIProvider>
  );
}

const key = 'TG';
export default {
  key,
  children: <TG />,
};
