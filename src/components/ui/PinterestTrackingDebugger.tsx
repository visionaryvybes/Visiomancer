'use client';

import React, { useEffect, useState } from 'react';
import { useConversions } from '@/context/ConversionsContext';

export default function PinterestTrackingDebugger() {
  const { getUserEmail } = useConversions();
  const [trackingData, setTrackingData] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = getUserEmail();
      const externalId = localStorage.getItem('visiomancer_external_id');
      const urlParams = new URLSearchParams(window.location.search);
      const clickId = urlParams.get('epik') || 
                     urlParams.get('pinterest_click_id') || 
                     urlParams.get('_epik') ||
                     urlParams.get('click_id');
      
      setTrackingData({
        email: email || 'Not set',
        externalId: externalId || 'Not generated',
        clickId: clickId || 'Not found',
        sourceUrl: window.location.href,
        userAgent: window.navigator.userAgent,
        pintrk: typeof window.pintrk !== 'undefined' ? 'Loaded' : 'Not loaded'
      });
    }
  }, [getUserEmail]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#E60023',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}
      >
        🐛 Pinterest Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'white',
      border: '2px solid #E60023',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#E60023' }}>Pinterest Tracking Debug</h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {Object.entries(trackingData).map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
            <strong style={{ color: '#666' }}>{key}:</strong>
            <span style={{ 
              wordBreak: 'break-all', 
              color: value === 'Not set' || value === 'Not found' || value === 'Not generated' ? '#dc3545' : '#28a745'
            }}>
              {String(value)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
        <button
          onClick={async () => {
            const response = await fetch('/api/conversions/status');
            const status = await response.json();
            alert(JSON.stringify(status, null, 2));
          }}
          style={{
            background: '#E60023',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            width: '100%'
          }}
        >
          Check API Status
        </button>
      </div>
    </div>
  );
} 