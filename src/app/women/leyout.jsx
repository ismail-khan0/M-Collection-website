import React, { ReactNode } from 'react';
export default function Layout({ children }) {
  return (
    <div className='mt-20'>
      {children}
    </div>
  );
}
