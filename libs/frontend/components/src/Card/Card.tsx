import React from 'react';
import { join, defaultTo } from 'ramda';

export interface ICardProps {
  className?: string;
  children?: any;
}

export const Card: React.FC<ICardProps> = (props: ICardProps) => {
  return (
    <div className={defaultTo('', props.className)}>
      <div className="bg-white shadow rounded w-full">{props.children}</div>
    </div>
  );
};
