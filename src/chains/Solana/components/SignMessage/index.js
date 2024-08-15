import {
  Button, Card, Space,
} from 'antd-mobile';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignMessage({ account }) {
  const handleSignMsg = async () => {
    try {
      const msg = 'Hello Solana';
      const encodedMsg = new TextEncoder().encode(msg);
      const ret = await solana.signMessage(encodedMsg, 'utf8');
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg}>签名</Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
