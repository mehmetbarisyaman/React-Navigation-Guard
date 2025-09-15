// Test file to verify React 19 compatibility
import React, { useState } from 'react';
import { useNavigationGuard } from '../src';

// Test component that validates React 19 compatibility
function React19CompatibilityTest() {
  const [hasChanges, setHasChanges] = useState(false);
  
  // Test the hook with React 19
  const { allowPendingNavigation, cancelPendingNavigation } = useNavigationGuard({
    shouldBlock: () => hasChanges,
    onNavigationAttempt: (url, isReload) => {
      console.log('Navigation blocked:', { url, isReload });
    }
  });

  // Test React 19 features
  return (
    <div>
      <h2>React 19 Compatibility Test</h2>
      <button onClick={() => setHasChanges(!hasChanges)}>
        Toggle Changes: {hasChanges ? 'Has Changes' : 'No Changes'}
      </button>
      <button onClick={allowPendingNavigation}>Allow Navigation</button>
      <button onClick={cancelPendingNavigation}>Cancel Navigation</button>
    </div>
  );
}

export default React19CompatibilityTest;