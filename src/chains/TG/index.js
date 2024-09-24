import { TonConnectUIProvider, TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

function TG() {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    <TonConnectUIProvider manifestUrl="https://app.ston.fi/tonconnect-manifest.json">
      <span>My App with React UI</span>
      <TonConnectButton />
      <div>
        <span>
          User-friendly address:
          {userFriendlyAddress}
        </span>
        <span>
          Raw address:
          {rawAddress}
        </span>
      </div>
    </TonConnectUIProvider>
  );
}

const key = 'TG';
export default {
  key,
  children: <TG />,
};
