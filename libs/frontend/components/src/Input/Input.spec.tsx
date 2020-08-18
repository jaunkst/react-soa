import React from 'react';
import { render } from '@testing-library/react';

import FrontendComponents from './frontend-components';

describe(' FrontendComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendComponents />);
    expect(baseElement).toBeTruthy();
  });
});
