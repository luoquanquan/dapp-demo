import { Col, Row } from 'antd';

import Common from './Common';
import DappSelf from './DappSelf';

function SignTransaction({ account, access, provider }) {
  return (
    <Row gutter={16}>
      <Col xs={24} lg={12}>
        <Common account={account} provider={provider} />
      </Col>
      <Col xs={24} lg={12}>
        <DappSelf account={account} access={access} />
      </Col>
    </Row>
  );
}

export default SignTransaction;
