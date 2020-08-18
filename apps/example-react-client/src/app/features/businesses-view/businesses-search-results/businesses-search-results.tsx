import { Rating, Card, ButtonGroup } from '@libs/frontend/components';
import { useService } from '@libs/frontend/utils';
import React, { useState, useEffect } from 'react';
import { useObservable } from 'rxjs-hooks';
import { BusinessesViewQuery, ISearchQueryResults } from '..';
import { DAY_OF_WEEK_MAP, DAY_OF_WEEK } from '@libs/isomorphic/models';
import { retryWhen } from 'rxjs/operators';
import { prop, clone, without } from 'ramda';

export const BusinesseSearchResults: React.FC = () => {
  const [businessesViewQuery] = [useService(BusinessesViewQuery)];

  const [visibleComments, setVisibleComments] = useState(new Set());

  const searchResults = useObservable<ISearchQueryResults>(
    () => businessesViewQuery.searchQueryResults$,
    {
      count: 0,
      limit: 0,
      results: [],
      skip: 0,
    }
  );

  function toggleVisibleReviews(id: number) {
    let comments = Array.from(visibleComments);
    if (visibleComments.has(id)) {
      comments = Array.from(without([id], comments));
    } else {
      comments.push(id);
      document
        .querySelector(`[data-review-section-id="${id}"]`)
        .scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }
    setVisibleComments(new Set(comments));
    // document.getElementById('searchResults').scroll(0, )
  }

  return (
    <div id="searchResults" className="overflow-y-auto flex-1 p-8 space-y-8">
      {searchResults.results.map((business) => {
        return (
          <Card key={business.id} className="max-w-3xl">
            <div className="flex flex-row justify-between border-b border-gray-300 items-center py-4 px-6">
              <div>
                <div className="text-xl font-bold">{business.name}</div>
              </div>

              <Rating score={business.avgRatingScore}>
                <div
                  className="cursor-pointer text-blue-500 select-none"
                  onClick={() => {
                    toggleVisibleReviews(business.id);
                  }}
                >
                  ({business.reviews.length})
                </div>
              </Rating>
            </div>

            <div className="flex flex-row justify-between border-b border-gray-300 py-4 px-6">
              <div className="space-y-6">
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                    Address
                  </label>
                  <div className="text-md">
                    <div>{business.addressLine1}</div>
                    <div>{business.addressLine2}</div>
                    <div>
                      {business.city}, {business.stateAbbr}, {business.postal}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                    Services
                  </label>
                  <div className="text-md">
                    {business.workTypes.map(prop('name')).join(', ')}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                    Service Areas
                  </label>
                  <div className="text-md">
                    {business.operatingCities.map(prop('name')).join(', ')}
                  </div>
                </div>
              </div>

              <div className="flow flex-col">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Business Hours
                </label>
                <table
                  className="border-collapse min-w-full font-mono"
                  cellSpacing="0"
                  cellPadding="0"
                >
                  <tbody>
                    {business.businessHours.map((businessHour) => {
                      return (
                        <tr key={businessHour.id}>
                          <td className="">
                            {DAY_OF_WEEK_MAP[businessHour.dayOfWeek]}
                          </td>
                          <td className="pl-2 text-right">
                            {businessHour.open} - {businessHour.close}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div data-review-section-id={business.id}>
              <div
                className={`p-6 ${
                  visibleComments.has(business.id) ? '' : 'hidden'
                }`}
              >
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                  Reviews
                </label>
                <div className="space-y-6 text-sm">
                  {business.reviews.map((review) => {
                    return (
                      <div key={review.id}>
                        <Rating score={review.ratingScore}></Rating>
                        <div>{review.customerComment}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
