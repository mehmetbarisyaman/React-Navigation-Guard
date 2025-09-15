import React, { useState } from 'react';
import { useNavigationGuard } from '../src';

function ExampleForm() {
  const [formData, setFormData] = useState('');
  const [originalData, setOriginalData] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const hasUnsavedChanges = formData !== originalData;
  
  const {
    allowPendingNavigation,
    cancelPendingNavigation
  } = useNavigationGuard({
    shouldBlock: () => hasUnsavedChanges,
    onNavigationAttempt: (targetUrl, isReload) => {
      console.log(`Navigation attempt to: ${targetUrl}, isReload: ${isReload}`);
      setShowModal(true);
    }
  });

  const handleSave = () => {
    setOriginalData(formData);
    console.log('Data saved!');
  };

  const handleConfirmLeave = () => {
    setShowModal(false);
    allowPendingNavigation();
  };

  const handleCancelLeave = () => {
    setShowModal(false);
    cancelPendingNavigation();
  };

  return (
    <div>
      <h2>Example Form with Navigation Guard</h2>
      <textarea
        value={formData}
        onChange={(e) => setFormData(e.target.value)}
        placeholder="Enter some data..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleSave} disabled={!hasUnsavedChanges}>
        Save
      </button>
      {hasUnsavedChanges && <p style={{color: 'orange'}}>You have unsaved changes!</p>}
      
      {showModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '1px solid #ccc',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p>You have unsaved changes. Are you sure you want to leave?</p>
          <button onClick={handleConfirmLeave}>Leave</button>
          <button onClick={handleCancelLeave} style={{marginLeft: '10px'}}>Stay</button>
        </div>
      )}
    </div>
  );
}

export default ExampleForm;