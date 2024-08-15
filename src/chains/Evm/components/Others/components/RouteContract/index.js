import {
  Button, Card, Space,
} from 'antd-mobile';
import { useContext, useState } from 'react';
// import {
//   encodeAbiParameters,
// } from 'viem';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';
// import routeContractABI from './abi.json';
import InputField from '../../../../../../components/InputField';
import btns from './btns';

function RouteContract() {
  const { account } = useContext(EvmContext);

  const [chainId, setChainId] = useState('');
  const [to, setTo] = useState('');
  const [callData, setCallData] = useState('');

  const [loading, setLoading] = useState(false);
  const fireWithParams = async (params) => {
    try {
      setLoading(true);

      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: params.chainId }] });
      const data = {
        from: account,
        to: params.to,
        value: '0x0',
        data: params.callData,
      };
      await ethereum.request({ method: 'eth_sendTransaction', params: [data] });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  /**
       const encodeData = encodeAbiParameters(
      routeContractABI,
      [{
        tokenIn: [{
          token: '0xB2f97c1Bd3bf02f5e74d13f02E3e26F93D77CE44',
          amount: '1000000',
          to: '0xeB7241b4eBbac80DD25FB85c56a562361AB33D5b',
        }],
        tokenOut: [{
          token: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
          amount: '992594',
        }],
      },
      [{
        to: '0xeB7241b4eBbac80DD25FB85c56a562361AB33D5b',
        callData: '0x32d5ea45000000000000000000000000b2f97c1bd3bf02f5e74d13f02e3e26f93d77ce4400000000000000000000000006efdbff2a14a7c8e15944d1f4a48f9f95f663a4000000000000000000000000993e19336003398c1119d9f125936ec9462233f4',
      },
      {
        to: to.trim(),
        callData: callData.trim(),
      }]],
    );
    `0x016cba5f${encodeData.slice(2)}`
   */

  const fire = async () => {
    if (chainId.startsWith('0x')) {
      fireWithParams({ to, callData, chainId });
    } else {
      fireWithParams({ to, callData, chainId: `0x${Number(chainId).toString(16)}` });
    }
  };

  return (
    <Card title="Route Contract">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card title="默认功能">
          <Space wrap>
            {btns.map((btn) => (
              <Button
                block
                loading={loading}
                disabled={!account}
                onClick={() => fireWithParams(btn)}
              >
                {btn.type}
              </Button>
            ))}
          </Space>
        </Card>

        <Card title="自定义功能">
          <InputField
            title="chainId"
            value={chainId}
            onChange={setChainId}
          />

          <InputField
            title="to"
            value={to}
            onChange={setTo}
          />

          <InputField
            title="callData"
            value={callData}
            onChange={setCallData}
          />

          <Button
            block
            disabled={!account || !to || !callData || !chainId}
            loading={loading}
            onClick={fire}
          >
            fire
          </Button>
        </Card>

      </Space>
    </Card>
  );
}

export default RouteContract;
