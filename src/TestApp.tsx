import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Florida First Roofing - Test App</h1>
      <p>If you can see this, React is working correctly.</p>
      <div style={{
        padding: '20px',
        background: '#f0f0f0',
        marginTop: '20px',
        borderRadius: '8px'
      }}>
        <h2>SOP System Status</h2>
        <p>Backend API: http://localhost:5001</p>
        <p>Frontend App: http://localhost:3000</p>
        <p>Database: 1,998 SOPs loaded</p>
      </div>
    </div>
  );
};

export default TestApp;