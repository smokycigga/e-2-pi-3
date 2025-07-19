'use client';

import { useState } from 'react';
import Sidebar from './sidebar';

const LayoutWrapper = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;