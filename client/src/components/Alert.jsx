import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function Alert({ type = 'info', message, title, className = '', children }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'error':
        return <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'info':
      default:
        return <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />;
    }
  };

  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      {getIcon()}
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{title}</div>}
        {message && <div>{message}</div>}
        {children}
      </div>
    </div>
  );
}

export default Alert;
