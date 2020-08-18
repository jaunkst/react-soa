import React from 'react';

export interface IRatingProps {
  score: number;
  suffix?: number | string;
  className?: string;
  children?: any;
  onClick?: Function;
}

export const Rating: React.FC<IRatingProps> = (props) => {
  return (
    <div
      className={`${props.className} flex flex-row`}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
      }}
    >
      <span className="material-icons text-orange-300">
        {props.score >= 1 ? 'star' : 'star_outline'}
      </span>
      <span className="material-icons text-orange-300">
        {props.score >= 2 ? 'star' : 'star_outline'}
      </span>
      <span className="material-icons text-orange-300">
        {props.score >= 3 ? 'star' : 'star_outline'}
      </span>
      <span className="material-icons text-orange-300">
        {props.score >= 4 ? 'star' : 'star_outline'}
      </span>
      <span className="material-icons text-orange-300">
        {props.score >= 5 ? 'star' : 'star_outline'}
      </span>
      {/* {props.suffix ? <span className="ml-2">{props.suffix}</span> : null} */}
      {props.children}
    </div>
  );
};
