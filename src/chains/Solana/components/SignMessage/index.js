import { Button, Card, Space } from 'antd-mobile';
import { message } from 'antd';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignMessage({ account }) {
  const handleSignMsg = async () => {
    try {
      const msg = 'Hello Solana';
      const ret = await solana.signMessage(msg);
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log('failed to sign message');
      console.log(error);
      toastFail();
      console.log('solana sign message: ', error, error.code);
      if (error.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        toastFail();
      }
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg}>
              签名
            </Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
