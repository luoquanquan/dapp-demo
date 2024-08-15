import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';
import bigData from './bigData';

function RareCases() {
  const { account } = useContext(EvmContext);
  const [loading, setLoading] = useState(false);

  const invokeEigenLayer = async () => {
    try {
      setLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x5283D291DBCF85356A21bA090E6db59121208b44',
          value: '0x0',
          data: '0xf123991e00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000095b247ccce49df14e87a8f20f12fcd23877873c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000fe4f44bee93503346a3ac9ee5a26b130a5796d60000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000f',
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const handleSignBigData = async () => {
    try {
      setLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }] });
      const data = {
        from: account,
        to: '0x800a2be9b6259e252ede4a5a041c23ab994f2962',
        value: '0x0',
        data: bigData,
      };
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [data],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Rare cases">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          onClick={invokeEigenLayer}
        >
          invoke eigenLayer
        </Button>

        <Button
          block
          loading={loading}
          onClick={handleSignBigData}
        >
          handleSignBigData
        </Button>
      </Space>
    </Card>
  );
}

export default RareCases;
