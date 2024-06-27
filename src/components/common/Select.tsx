import { FunctionComponent, PropsWithChildren } from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FunctionComponent<PropsWithChildren<SelectProps>> = (props) => {
  const { label, value, onChange, children } = props;
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <select className="select select-bordered select-primary" value={value} onChange={onChange}>
        {children}
      </select>
    </label>
  );
};

export default Select;
