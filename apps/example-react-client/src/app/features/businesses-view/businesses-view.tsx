import { LayoutHeader, Layout, LayoutBody } from '@libs/frontend/components';

import React from 'react';
import { BusinesseSearch } from './businesses-search/businesses-search';
import { BusinesseSearchResults } from './businesses-search-results/businesses-search-results';

export const BusinessesView: React.FC = () => {
  return (
    <Layout>
      <LayoutHeader />
      <LayoutBody>
        <div className="w-sm max-w-sm overflow-y-auto border-r border-gray-400 shadow">
          <BusinesseSearch />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto bg-gray-100">
          <BusinesseSearchResults />
        </div>
      </LayoutBody>
    </Layout>
  );
};
