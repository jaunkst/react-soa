import React from 'react';

export interface ILayoutBodySectionProps {
  className?: string;
  children?: any;
}

export const LayoutBodySection: React.FC<ILayoutBodySectionProps> = (
  props: ILayoutBodySectionProps
) => {
  const className = ['flex flex-col overflow-y-auto', props.className].join(
    ' '
  );
  return <div className={className}>{props.children}</div>;
};
