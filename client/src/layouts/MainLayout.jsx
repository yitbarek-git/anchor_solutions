import React from 'react';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { AIAssistantWidget } from '../components/AIAssistantWidget.jsx';

export function MainLayout({ currentPath, navigate, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPath={currentPath} navigate={navigate} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer navigate={navigate} />
      <AIAssistantWidget navigate={navigate} />
    </div>
  );
}

export default MainLayout;
