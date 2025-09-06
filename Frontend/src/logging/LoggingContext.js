import React, { createContext, useContext } from 'react';

const LoggingContext = createContext();

export function LoggingProvider({ children }) {
  const log = (message, data = null) => {
    console.log('[LOG]', message, data);
    fetch('http://localhost:5000/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        data, 
        timestamp: new Date().toISOString() 
      })
    }).catch((err) => {
      console.warn('Failed to send log to service:', err.message);
    });
  };

  return (
    <LoggingContext.Provider value={{ log }}>
      {children}
    </LoggingContext.Provider>
  );
}

export function useLogging() {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return context;
}
