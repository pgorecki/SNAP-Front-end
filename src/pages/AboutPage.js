import React from 'react';

export default function AboutPage() {
  return (
    <div>
      <p>
        Build:{' '}
        {process.env.REACT_APP_BUILD_VERSION || (
          <i>please set REACT_APP_BUILD_VERSION environment variable</i>
        )}
      </p>
    </div>
  );
}
