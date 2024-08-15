import { Card, Space } from 'antd-mobile';
import { Typography } from 'antd';

const typeMap = {
  eoa: 'eoa',
  contract: 'contract',
  strongEoa: 'strongEoa',
};

const titleMap = {
  [typeMap.eoa]: 'Black EOA Address',
  [typeMap.contract]: 'Black Contract Address',
  [typeMap.strongEoa]: 'Strong Black EOA Address',
};

function BlackAddress({ address, type = 'eoa' }) {
  if (!address) {
    return null;
  }

  return (
    <Card title={titleMap[type] || 'Unknown black address type'}>
      <Space direction="vertical">
        <Typography.Text copyable>
          {address}
        </Typography.Text>
      </Space>
    </Card>
  );
}

BlackAddress.typeMap = typeMap;

export default BlackAddress;
