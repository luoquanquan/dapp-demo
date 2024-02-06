import { Button, Card, Space } from 'antd';

function Sender() {
  const contractId = 'dev-1635836502908-29682237937904';

  const requestSignIn = async () => {
    try {
      const res = await window.near.requestSignIn({
        contractId,
        methodNames: [],
      });

      console.log('signin res: ', res);

      if (!res.error) {
        if (res && res.accessKey) {
          console.log('Current log: res: ', res);
        } else {
          console.log('res: ', res);
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  return (
    <Card title="Sender">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button onClick={requestSignIn}>requestSignIn</Button>
      </Space>
    </Card>
  );
}

export default Sender;
