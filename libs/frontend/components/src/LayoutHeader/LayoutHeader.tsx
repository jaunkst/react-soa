import React from 'react';

export interface ILayoutHeaderProps {
  className?: string;
  children?: any;
}

export const LayoutHeader: React.FC<ILayoutHeaderProps> = (
  props: ILayoutHeaderProps
) => {
  return (
    <nav className="flex items-center justify-between flex-wrap p-6 w-full bg-blue-900">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          Fullstack Example
        </span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-blue-200 border-white hover:text-white hover:border-white">
          <span className="material-icons">menu</span>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
          >
            Frontend Design
          </a>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
          >
            Backend Design
          </a>
        </div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-500 hover:bg-white mt-4 lg:mt-0"
          >
            Github
          </a>
        </div>
      </div>
    </nav>
  );
};
