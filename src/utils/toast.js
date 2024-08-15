/* eslint-disable import/prefer-default-export */
import { message } from 'antd';

export const toastSuccess = () => {
  message.success('Cool, operation succeed, open console to check result ~');
};

export const toastFail = () => {
  message.error('ohh no, operation failed ~');
};
