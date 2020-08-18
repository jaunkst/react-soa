import React from 'react';
import { Rating } from '../Rating/Rating';

export interface IRatingFilterProps {
  label: string;
  selectedRaiting: SELECTED_RATING;
  className?: string;
  children?: any;
  onRatingClick: Function;
}

export enum SELECTED_RATING {
  NONE,
  ONE_STAR,
  TWO_STAR,
  THREE_STAR,
  FOUR_STAR,
  FIVE_STAR,
}

export const RatingFilter: React.FC<IRatingFilterProps> = (props) => {
  return (
    <div>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
        htmlFor="grid-state"
      >
        {props.label}
      </label>
      <div>
        <Rating
          onClick={() => {
            props.onRatingClick(SELECTED_RATING.ONE_STAR);
          }}
          className={`select-none cursor-pointer ${
            props.selectedRaiting === SELECTED_RATING.ONE_STAR
              ? 'font-bold'
              : ''
          }`}
          score={SELECTED_RATING.ONE_STAR}
          suffix="& Up"
        ></Rating>
        <Rating
          onClick={() => {
            props.onRatingClick(SELECTED_RATING.TWO_STAR);
          }}
          className={`select-none cursor-pointer ${
            props.selectedRaiting === SELECTED_RATING.TWO_STAR
              ? 'font-bold'
              : ''
          }`}
          score={SELECTED_RATING.TWO_STAR}
          suffix="& Up"
        ></Rating>
        <Rating
          onClick={() => {
            props.onRatingClick(SELECTED_RATING.THREE_STAR);
          }}
          className={`select-none cursor-pointer ${
            props.selectedRaiting === SELECTED_RATING.THREE_STAR
              ? 'font-bold'
              : ''
          }`}
          score={SELECTED_RATING.THREE_STAR}
          suffix="& Up"
        ></Rating>
        <Rating
          onClick={() => {
            props.onRatingClick(SELECTED_RATING.FOUR_STAR);
          }}
          className={`select-none cursor-pointer ${
            props.selectedRaiting === SELECTED_RATING.FOUR_STAR
              ? 'font-bold'
              : ''
          }`}
          score={SELECTED_RATING.FOUR_STAR}
          suffix="& Up"
        ></Rating>
      </div>
    </div>
  );
};
