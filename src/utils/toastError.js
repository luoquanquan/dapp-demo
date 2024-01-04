import { message } from 'antd';

const toastError = (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
  message.error('操作失败, 请到控制台查看错误详情');
};

export default toastError;
