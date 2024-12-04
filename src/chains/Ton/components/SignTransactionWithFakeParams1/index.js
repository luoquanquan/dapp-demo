import TonWeb from 'tonweb';
import { Button, Card, Space } from 'antd-mobile';
import dayjs from 'dayjs';
import { myTonAddress } from '../../const';

function SignTransactionWithFakeParams({ address }) {
  // const [tonConnectUI] = useTonConnectUI();
  // const address = useTonAddress();
  // 签名时间 7 天内
  const defaultValidUntil = dayjs().add(7, 'day').unix();

  const sendTon = ({
    toAddress = myTonAddress, validUntil = defaultValidUntil, from,
    network,
    messagesUndefined,
    messages = [
      {
        address: toAddress,
        amount: TonWeb.utils.toNano('0.0001').toString(),
      },
    ],
  }) => () => {
    const params = {
      network,
      validUntil,
      from,
      messages,
    };

    if (messagesUndefined) {
      params.messages = undefined;
    }

    console.log('Current log: params: ', params);

    ton.signTransaction(params);
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
          sendTon with -1 day
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendTon({
            validUntil: dayjs().add(3, 'minute').unix(),
          })}
        >
          sendTon with +3 minute
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendTon({
            validUntil: dayjs().add(1, 'day').unix(),
          })}
        >
          sendTon with +1 day
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendTon({
            network: '-3',
          })}
        >
          sendTon with fake network
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
            toAddress: 'kQCKWpx7cNMpvmcN50bM5lLUZHZRFKqYA4xmw9j0ry0Zs0TG',
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
