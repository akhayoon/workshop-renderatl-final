import React from 'react';

const iconWrapper = (
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
) => {
  return () => <Icon />;
};

export default iconWrapper;
