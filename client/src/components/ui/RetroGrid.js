import React from 'react';
import { Box } from '@mui/material';

export function RetroGrid() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400%',
          height: '400%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          background: `
            linear-gradient(90deg, rgba(24, 243, 73, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(24, 243, 73, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid 20s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          background: `
            linear-gradient(90deg, rgba(4, 168, 191, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(4, 168, 191, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'grid 15s linear infinite reverse',
        }
      }}
    />
  );
} 