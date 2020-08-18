import React from 'react';

export interface ILayoutProps {
  className?: string;
  children?: any;
}

export const Layout: React.FC<ILayoutProps> = (props: ILayoutProps) => {
  return <div className="flex flex-col min-h-full">{props.children}</div>;
};
