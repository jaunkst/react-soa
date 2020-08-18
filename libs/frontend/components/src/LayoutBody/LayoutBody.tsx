import React from 'react';

export interface ILayoutBodyProps {
  className?: string;
  children?: any;
}

export const LayoutBody: React.FC<ILayoutBodyProps> = (
  props: ILayoutBodyProps
) => {
  return (
    <div className="flex flow-col flex-1 overflow-hidden flex-row">
      {props.children}
    </div>
  );
};
