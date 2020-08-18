import React from 'react';

export interface IInputProps {
  label: string;
  className?: string;
  children?: any;
  onChange: Function;
}

export const Input: React.FC<IInputProps> = (props) => {
  return (
    <div>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
        htmlFor="grid-state"
      >
        {props.label}
      </label>
      <input
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        type="input"
        placeholder=""
      ></input>
    </div>
  );
};
