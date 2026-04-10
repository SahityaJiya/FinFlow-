import React, { createContext, useContext, useState, ReactNode } from 'react';

const RefreshContext = createContext<{
  refreshKey: number;
  triggerRefresh: () => void;
}>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const RefreshProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
