import { TonConnectUIProvider, TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

function APP() {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);

  return (
    <>
      <span>My App with React UI</span>
      <TonConnectButton />
      <div>
        <div>
          User-friendly address:
          {userFriendlyAddress}
        </div>
        <div>
          Raw address:
          {rawAddress}
        </div>
      </div>
    </>
  );
}

function TG() {
  return (
    <TonConnectUIProvider manifestUrl="https://app.ston.fi/tonconnect-manifest.json">
      <APP />
    </TonConnectUIProvider>
  );
}

const key = 'TG';
export default {
  key,
  children: <TG />,
};
