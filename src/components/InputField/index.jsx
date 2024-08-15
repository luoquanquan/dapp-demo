import { Input } from 'antd-mobile';

function InputField({ title, onChange, value }) {
  return (
    <div style={{ marginBottom: '4px' }}>
      <div style={{ marginBottom: '6px' }}>
        {title}
        :
      </div>

      <Input onChange={onChange} value={value} placeholder={`please input ${title}`} />
    </div>
  );
}

export default InputField;
