import React, { useState, useEffect } from 'react';

export interface IHour12 {
  hour: number;
  amPm: AM_PM;
}

export interface IHour12SelectProps {
  label: string;
  hourOption: {
    hour: number;
    amPm: AM_PM;
  };
  onSelect: Function;
  className?: string;
  children?: any;
}

export enum AM_PM {
  AM = 'am',
  PM = 'pm',
}

export const Hour24Select: React.FC<IHour12SelectProps> = (
  props: IHour12SelectProps
) => {
  const className = `
    select-none hover:scale-110 focus:outline-none flex justify-center px-4 py-2 
    hover:bg-gray-200 bg-gray-100 text-gray-700 border border-gray-400 flex-1
  `;
  return (
    <div className="flex-1">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold "
        htmlFor="grid-state"
      >
        {props.label}
      </label>
      <div className="flex flex-row items-center">
        <select
          value={props.hourOption.hour}
          onChange={(e) => {
            props.onSelect({
              hour: parseInt(e.target.value),
              amPm: props.hourOption.amPm,
            });
          }}
          name="hours"
          className={[className, 'cursor-pointer', 'rounded-l'].join(' ')}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <select
          value={props.hourOption.amPm}
          onChange={(e) => {
            props.onSelect({
              hour: props.hourOption.hour,
              amPm: e.target.value as AM_PM,
            });
          }}
          name="ampm"
          className={[
            className,
            'border-l-0',
            'cursor-pointer',
            'rounded-r',
          ].join(' ')}
        >
          <option value={AM_PM.AM}>AM</option>
          <option value={AM_PM.PM}>PM</option>
        </select>
      </div>
    </div>
  );
};
