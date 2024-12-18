import TonWeb from 'tonweb';
import { Button, Card, Space } from 'antd-mobile';
import { Address, beginCell, toNano } from '@ton/ton';
import { blackTonAddress, myTonAddress, strongBlackTonAddress } from '../../const';

const tonweb = new TonWeb();
function SignTransaction({ address }) {
  // const [tonConnectUI] = useTonConnectUI();
  // const address = useTonAddress();
  // 签名时间 7 天内
  const validUntil = Math.floor(Date.now() / 1000) + 604800;

  const sendFish = (toAddress = myTonAddress) => async () => {
    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: 'EQATcUc69sGSCCMSadsVUKdGwM1BMKS-HKCWGPk60xZGgwsK' });
    const fromAddress = (await jettonMinter.getJettonWalletAddress(
      new TonWeb.utils.Address(address),
    )).toString(true, true, true, false);
    const body = beginCell()
      .storeUint(0xf8a7ea5, 32) // jetton 转账操作码
      .storeUint(0, 64) // query_id:uint64
      .storeCoins('100000000') // amount:(VarUInteger 16) -  转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
      // 接收人的账户地址地址
      .storeAddress(Address.parse(toAddress))
      // 发送人的地址
      .storeAddress(Address.parse(address)) // response_destination:MsgAddress
      .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
      .storeCoins('1000000') // forward_ton_amount:(VarUInteger 16)
      .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
      .endCell();

    const myTransaction = {
      validUntil,
      messages: [
        {
          address: fromAddress, // 发送方 Jetton 钱包
          amount: toNano('0.05').toString(), // 用于手续费，超额部分将被退回
          payload: body.toBoc().toString('base64'), // 带有 Jetton 转账 body 的载荷
        },
      ],
    };
    const res = await ton.send(
      {
        method: 'sendTransaction',
        params: [myTransaction],
        id: Date.now(),
      },
    );
    console.log(res);
  };

  const sendTon = (toAddress = myTonAddress) => async () => {
    const res = await ton.send({
      method: 'sendTransaction',
      params: [{
        validUntil,
        messages: [
          {
            address: toAddress,
            amount: TonWeb.utils.toNano('0.0001').toString(),
          },
        ],
      }],
      id: Date.now(),
    });
  };

  return (
    <Card title="SignTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!address}
          onClick={sendTon()}
        >
          sendTon
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          onClick={sendTon(blackTonAddress)}
        >
          sendTon to Black Address
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          onClick={sendTon(strongBlackTonAddress)}
        >
          sendTon to Strong Black Address
        </Button>

        <Button
          block
          disabled={!address}
          onClick={sendFish()}
        >
          sendFish
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          onClick={sendFish(blackTonAddress)}
        >
          sendFish to Black Address
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          onClick={sendFish(strongBlackTonAddress)}
        >
          sendFish to Strong Black Address
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
