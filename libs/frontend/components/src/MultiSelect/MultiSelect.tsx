import {
  contains,
  defaultTo,
  equals,
  filter,
  gte,
  innerJoin,
  map,
  not,
  pluck,
  when,
  toLower,
} from 'ramda';
import React, { useEffect, useRef, useState } from 'react';

export enum MULTI_SELECT_ACTION {
  REMOVE_ITEM,
  ADD_ITEM,
}

export interface IMultiSelectOption {
  id: number | string;
  label: string;
}

export interface IMultiSelectProps {
  label: string;
  selectedIds?: number[] | string[];
  options?: IMultiSelectOption[];
  className?: string;
  children?: any;
  onAction: Function;
}

export const MultiSelect: React.FC<IMultiSelectProps> = (
  props: IMultiSelectProps
) => {
  const [isSelectOptionsOpen, setSelectOptionsOpen] = useState(false);
  const [searchString, setSearchString] = useState('');

  const selectedIds = defaultTo([], props.selectedIds);
  const options = defaultTo([], props.options);
  const selectedOptions = innerJoin(
    (record: IMultiSelectOption, id) => record.id === id,
    options,
    selectedIds
  );

  const selectedOptionsIds = new Set(pluck('id', selectedOptions));

  const unselectedOptions = filter((option) => {
    return not(selectedOptionsIds.has(option.id));
  }, options);

  const filteredUnselectedOptions = filter((option: IMultiSelectOption) => {
    return contains(toLower(searchString.valueOf()), toLower(option.label));
  }, unselectedOptions);

  const wrapperRef = useRef(null);

  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSelectOptionsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
        htmlFor="grid-state"
      >
        {props.label}
      </label>

      <div className="flex flex-1 flex-row bg-gray-100 border border-gray-300 rounded-lg w-full min-h-10">
        <div className="flex flex-wrap flex-1 w-full space-y-1 space-x-1 pb-1">
          {map((option: IMultiSelectOption) => {
            return (
              <div
                key={option.id}
                className="rounded-md bg-gray-300 pl-2 pr-4 flex flex-row items-center first:ml-1 first:mt-1"
              >
                <span
                  className="material-icons text-sm cursor-pointer"
                  onClick={() => {
                    setSelectOptionsOpen(false);
                    props.onAction(MULTI_SELECT_ACTION.REMOVE_ITEM, option.id);
                  }}
                >
                  close
                </span>
                <div className="text-xs ml-1">{option.label}</div>
              </div>
            );
          }, selectedOptions)}
        </div>

        {when(
          equals(true),
          () => (
            <div
              className="bg-blue-500 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 cursor-pointer select-none rounded-r-md hover:bg-blue-600"
              onClick={() => {
                setSelectOptionsOpen(not(isSelectOptionsOpen.valueOf()));
                setSearchString('');
              }}
            >
              <span className="material-icons text-sm text-white">add</span>
            </div>
          ),
          not(equals(0, unselectedOptions.length))
        )}
      </div>

      {when(
        equals(true),
        () => {
          return (
            <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg w-56 bg-white p-1 z-10 border border-gray-400">
              {when(
                equals(true),
                () => (
                  <input
                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                    type="input"
                    placeholder="search..."
                    onChange={(e) => {
                      setSearchString(e.target.value);
                    }}
                  ></input>
                ),
                gte(unselectedOptions.length, 6)
              )}

              <div className="rounded-md bg-white shadow-xs max-h-40 overflow-y-scroll mt-1">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {map((option: IMultiSelectOption) => {
                    return (
                      <div key={option.id} className="odd:bg-gray-100">
                        <div
                          onClick={(e) => {
                            props.onAction(
                              MULTI_SELECT_ACTION.ADD_ITEM,
                              option.id
                            );
                          }}
                          className="flex flex-row items-center space-y-2 space-x-2 pl-3 pr-4 py-1 cursor-pointer select-none hover:bg-gray-300"
                        >
                          {option.label}
                        </div>
                      </div>
                    );
                  }, filteredUnselectedOptions)}

                  {when(
                    equals(true),
                    () => (
                      <div className="flex flex-row items-center space-y-2 space-x-2 pl-3 pr-4 py-1 select-none bg-gray-200">
                        ...
                      </div>
                    ),
                    equals(0, filteredUnselectedOptions.length)
                  )}
                </div>
              </div>
            </div>
          );
        },
        isSelectOptionsOpen
      )}
    </div>
  );
};
