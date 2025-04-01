import React from 'react';
import { Box } from '@radix-ui/themes';

interface EducationLayoutProps {
  children: React.ReactNode;
}

const EducationLayout: React.FC<EducationLayoutProps> = ({ children }) => {
  return (
    <Box className="w-full">
      {children}
    </Box>
  );
};

export default EducationLayout;