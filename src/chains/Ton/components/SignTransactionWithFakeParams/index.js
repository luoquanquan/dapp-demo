import TonWeb from 'tonweb';
import { Button, Card, Space } from 'antd-mobile';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import { myTonAddress } from '../../const';

function SignTransactionWithFakeParams() {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  // 签名时间 7 天内
  const defaultValidUntil = dayjs().add(7, 'day').unix();

  const sendTon = ({
    toAddress = myTonAddress, validUntil = defaultValidUntil, from,
    messagesUndefined,
    messages = [
      {
        address: toAddress,
        amount: TonWeb.utils.toNano('0.0001').toString(),
      },
    ],
  }) => () => {
    const params = {
      validUntil,
      from,
      messages,
    };

    if (messagesUndefined) {
      params.messages = undefined;
    }

    console.log('Current log: params: ', params);

    tonConnectUI.sendTransaction(params);
  };

  return (
    <Card title="SignTransactionWithFakeParams Open console to See the params">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!address}
          onClick={sendTon({
            validUntil: dayjs().subtract(1, 'day').unix(),
          })}
        >
          sendTon with fake valid_until
        </Button>
        <Button
          block
          disabled={!address}
          onClick={sendTon({
            from: '0:6b273bdc8b12c9ad3d0daf05950d520fd6c6d70ce16e1bedc7402e2d52d0e5b5',
          })}
        >
          sendTon with fake from
        </Button>
        <Button
          block
          disabled={!address}
          onClick={sendTon({
            toAddress: '0:6b273bdc8b12c9ad3d0daf05950d520fd6c6d70ce16e1bedc7402e2d52d0e55b',
          })}
        >
          sendTon with fake address
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendTon({ messagesUndefined: true })}
        >
          sendTon with undefined messages
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendTon({ messages: [] })}
        >
          sendTon with [] messages
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransactionWithFakeParams;
