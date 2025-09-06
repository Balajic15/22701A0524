import React, { createContext, useContext } from 'react';

const LoggingContext = createContext();

export function LoggingProvider({ children }) {
  const log = (message, data = null) => {
    
    fetch('http://localhost:5000/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, data, timestamp: new Date().toISOString() })
    }).catch(() => {});
  };

  return (
    <LoggingContext.Provider value={{ log }}>
      {children}
    </LoggingContext.Provider>
  );
}

export function useLogging() {
  return useContext(LoggingContext);
}
