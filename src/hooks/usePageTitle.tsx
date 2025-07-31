import React, { createContext, useContext, useState } from 'react';

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);


const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');
  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

function usePageTitle() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error('usePageTitle must be used within a PageTitleProvider');
  return ctx;
}

export { PageTitleProvider, usePageTitle };
