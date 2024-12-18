/* eslint-disable import/prefer-default-export */
import { message } from 'antd';

export const toastSuccess = (msg = 'Cool, operation succeed, open console to check result ~') => {
  message.success(msg);
};

export const toastFail = (msg = 'ohh no, operation failed ~') => {
  message.error(msg);
};
