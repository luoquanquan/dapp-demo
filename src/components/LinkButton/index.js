/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';

function LinkButton({ children, href, ...otherProps }) {
  return (
    <Button block type="link" target="_blank" href={href} {...otherProps}>{children}</Button>
  );
}

export default LinkButton;
