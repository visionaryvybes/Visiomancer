'use client';

import React, { useState, useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';
import EmailCollectionBanner from './EmailCollectionBanner';

export default function EmailCollectionWrapper() {
  const [showBanner, setShowBanner] = useState(false);
  const { getUserEmail } = useConversions();

  useEffect(() => {
    // Check if user has already provided email
    const hasEmail = getUserEmail();
    
    // Check if we've already shown the banner in this session
    const hasShownBanner = sessionStorage.getItem('visiomancer_email_banner_shown');
    
    // Show banner if no email and haven't shown it yet
    if (!hasEmail && !hasShownBanner) {
      // Delay showing banner by 2 seconds to not be intrusive
      const timer = setTimeout(() => {
        setShowBanner(true);
        sessionStorage.setItem('visiomancer_email_banner_shown', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [getUserEmail]);

  // Add/remove body class for top padding when banner is visible
  useEffect(() => {
    if (showBanner) {
      document.body.classList.add('has-email-banner');
    } else {
      document.body.classList.remove('has-email-banner');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-email-banner');
    };
  }, [showBanner]);

  const handleClose = () => {
    setShowBanner(false);
  };

  return (
    <>
      <EmailCollectionBanner
        isVisible={showBanner}
        onClose={handleClose}
      />
      {/* Add global CSS for banner spacing */}
      {showBanner && (
        <style jsx global>{`
          .has-email-banner {
            padding-top: 80px;
          }
          .has-email-banner header {
            top: 80px;
          }
          @media (min-width: 640px) {
            .has-email-banner {
              padding-top: 60px;
            }
            .has-email-banner header {
              top: 60px;
            }
          }
        `}</style>
      )}
    </>
  );
} 