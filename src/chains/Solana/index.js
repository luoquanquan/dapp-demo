/* eslint-disable class-methods-use-this */
import { Space } from 'antd-mobile';

import useConnect from './hooks/useConnect';
import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';
import DontHaveWallet from '../../components/DontHaveWallet';

const key = 'Solana';

// eslint-disable-next-line no-unused-vars
class AppReadyEvent extends Event {
  #detail;

  get detail() {
    return this.#detail;
  }

  get type() {
    return 'wallet-standard:app-ready';
  }

  constructor(api) {
    super('wallet-standard:app-ready', {
      bubbles: false,
      cancelable: false,
      composed: false,
    });
    this.#detail = api;
  }

  /** @deprecated */
  preventDefault() {
    throw new Error('preventDefault cannot be called');
  }

  /** @deprecated */
  stopImmediatePropagation() {
    throw new Error('stopImmediatePropagation cannot be called');
  }

  /** @deprecated */
  stopPropagation() {
    throw new Error('stopPropagation cannot be called');
  }
}
function Solana() {
  const {
    account, handleConnect, connection, handleDisconnect,
  } = useConnect();
  // useEffect(() => {
  //   try {
  //     window.addEventListener(
  //       'wallet-standard:register-wallet',
  //       ({ detail: callback }) =>
  //         callback({
  //           register: (sol) => {
  //             console.log(sol, 'register-wallet callback');
  //           },
  //         }),
  //     );
  //   } catch (error) {
  //     console.error(
  //       'wallet-standard:register-wallet event listener could not be added\n',
  //       error,
  //     );
  //   }
  //   try {
  //     window.dispatchEvent(
  //       new AppReadyEvent({
  //         register: (sol) => {
  //           console.log(sol, 'app ready callback');
  //         },
  //       }),
  //     );
  //   } catch (error) {
  //     console.error(
  //       'wallet-standard:app-ready event could not be dispatched\n',
  //       error,
  //     );
  //   }
  // }, []);
  if (!window.solana) {
    return <DontHaveWallet chain={key} />;
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect
        handleConnect={handleConnect}
        account={account}
        handleDisconnect={handleDisconnect}
      />
      <SignMessage account={account} />
      <SignTransaction account={account} connection={connection} />
    </Space>
  );
}

export default {
  key,
  children: <Solana />,
};
