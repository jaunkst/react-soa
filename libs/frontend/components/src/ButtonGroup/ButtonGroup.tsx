import React from 'react';

export interface IButtonGroupOption {
  id: number;
  label: string;
}

export interface IButtonGroupProps {
  label: string;
  options: IButtonGroupOption[];
  selectedOptions: number[];
  suffix?: number | string;
  className?: string;
  children?: any;
  onClick?: Function;
}

export const ButtonGroup: React.FC<IButtonGroupProps> = (props) => {
  return (
    <div>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
        htmlFor="grid-state"
      >
        {props.label}
      </label>

      <div className="flex">
        {props.options.map((option, index) => {
          let className = `
            focus:outline-none flex justify-center px-4 py-2
            cursor-pointer  bg-gray-100 border  
            flex-1 select-none
          `;

          const isSelected = props.selectedOptions.includes(option.id);

          if (index === 0) {
            className += ' rounded-l';
          } else if (index === props.options.length - 1) {
            className += ' rounded-r border-l-0';
          } else {
            className += ' border-l-0';
          }

          if (isSelected) {
            className +=
              ' border-blue-600 hover:bg-blue-600 bg-blue-500 text-white ';
          } else {
            className += ' border-gray-400 hover:bg-gray-200 text-gray-700';
          }

          return (
            <button
              key={option.id}
              className={className}
              onClick={() => {
                if (props.onClick) {
                  props.onClick(option.id);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

<button
  className="
              text-base
              rounded-l-none
              border-l-0
              hover:scale-110
              focus:outline-none
              flex
              justify-center
              px-4
              py-2
              rounded
              cursor-pointer 
              hover:bg-blue-200  
              bg-blue-100 
              text-blue-700 
              border
              border-blue-600
              transition"
>
  <div className="flex leading-5">Weekend</div>
</button>;
