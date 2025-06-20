'use client';

import React, { useState, useEffect } from 'react';
import { useConversions } from '@/context/ConversionsContext';
import EmailCollectionModal from './EmailCollectionModal';

export default function EmailCollectionWrapper() {
  const [showModal, setShowModal] = useState(false);
  const { getUserEmail } = useConversions();

  useEffect(() => {
    // Check if user has already provided email
    const hasEmail = getUserEmail();
    
    // Check if we've already shown the modal in this session
    const hasShownModal = sessionStorage.getItem('visiomancer_email_modal_shown');
    
    // Show modal if no email and haven't shown it yet
    if (!hasEmail && !hasShownModal) {
      // Delay showing modal by 3 seconds to not be intrusive
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem('visiomancer_email_modal_shown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [getUserEmail]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <EmailCollectionModal
      isOpen={showModal}
      onClose={handleClose}
      title="Enhance Your Experience"
      message="Help us provide better recommendations and track your interests. Your email improves our analytics and helps us serve you better."
    />
  );
} 