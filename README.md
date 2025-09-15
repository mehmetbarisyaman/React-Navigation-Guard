# React Navigation Guard

A React hook that prevents navigation when there are unsaved changes, providing a seamless user experience by showing confirmation dialogs before leaving pages with unsaved data.

## Features

- 🛡️ **Prevent accidental navigation** away from pages with unsaved changes
- 🔄 **Handle browser refresh attempts** (F5, Ctrl+R)
- 🚪 **Intercept beforeunload events** for external navigation
- ⚡ **TypeScript support** with full type definitions
- 🎯 **React Router integration** with programmatic navigation control
- 🎨 **Customizable callbacks** for handling navigation attempts

## Installation

```bash
npm install react-navigation-guard
```

```bash
yarn add react-navigation-guard
```

```bash
pnpm add react-navigation-guard
```

## Prerequisites

This package requires:
- React 16.8.0 or higher (for hooks support) - **✅ React 19 compatible**
- react-router-dom 6.0.0 or higher

## Basic Usage

```tsx
import React, { useState } from 'react';
import { useNavigationGuard } from 'react-navigation-guard';

function MyForm() {
  const [formData, setFormData] = useState('');
  const [originalData, setOriginalData] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Determine if there are unsaved changes
  const hasUnsavedChanges = formData !== originalData;
  
  const {
    allowPendingNavigation,
    cancelPendingNavigation
  } = useNavigationGuard({
    shouldBlock: () => hasUnsavedChanges,
    onNavigationAttempt: (targetUrl, isReload) => {
      setShowModal(true);
    }
  });

  const handleSave = () => {
    // Save logic here
    setOriginalData(formData);
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
      <textarea
        value={formData}
        onChange={(e) => setFormData(e.target.value)}
        placeholder="Enter some data..."
      />
      <button onClick={handleSave}>Save</button>
      
      {showModal && (
        <div className="modal">
          <p>You have unsaved changes. Are you sure you want to leave?</p>
          <button onClick={handleConfirmLeave}>Leave</button>
          <button onClick={handleCancelLeave}>Stay</button>
        </div>
      )}
    </div>
  );
}
```

## Advanced Usage

### Global Navigation Control

For cases where you need to control navigation from outside the component:

```tsx
import { guardedNavigateGlobal } from 'react-navigation-guard';
import { useNavigate } from 'react-router-dom';

function SomeComponent() {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    // This will respect the navigation guard
    guardedNavigateGlobal(navigate, '/other-page');
  };
  
  return <button onClick={handleNavigation}>Go to Other Page</button>;
}
```

### Custom Modal Implementation

```tsx
import { useNavigationGuard } from 'react-navigation-guard';

function FormWithCustomModal() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [navigationState, setNavigationState] = useState({
    show: false,
    targetUrl: '',
    isReload: false
  });

  const { allowPendingNavigation, cancelPendingNavigation } = useNavigationGuard({
    shouldBlock: () => hasUnsavedChanges,
    onNavigationAttempt: (targetUrl, isReload) => {
      setNavigationState({
        show: true,
        targetUrl,
        isReload
      });
    }
  });

  const handleLeave = () => {
    setNavigationState(prev => ({ ...prev, show: false }));
    allowPendingNavigation();
  };

  const handleStay = () => {
    setNavigationState(prev => ({ ...prev, show: false }));
    cancelPendingNavigation();
  };

  return (
    <div>
      {/* Your form here */}
      
      {navigationState.show && (
        <CustomModal
          title={navigationState.isReload ? "Reload Page?" : "Leave Page?"}
          message={`You have unsaved changes. ${
            navigationState.isReload 
              ? "Are you sure you want to reload?" 
              : `Are you sure you want to navigate to ${navigationState.targetUrl}?`
          }`}
          onConfirm={handleLeave}
          onCancel={handleStay}
        />
      )}
    </div>
  );
}
```

## API Reference

### `useNavigationGuard(options)`

The main hook for setting up navigation protection.

#### Parameters

- `options: NavigationGuardOptions`

#### Options

```typescript
interface NavigationGuardOptions {
  shouldBlock: () => boolean;
  onNavigationAttempt: (targetUrl: string, isReload: boolean) => void;
}
```

- **`shouldBlock`**: A function that returns `true` if navigation should be blocked
- **`onNavigationAttempt`**: Callback fired when navigation is attempted
  - `targetUrl`: The URL being navigated to (empty string for reloads)
  - `isReload`: `true` if this is a page reload attempt, `false` for route changes

#### Returns

```typescript
interface NavigationGuardReturn {
  allowPendingNavigation: () => void;
  cancelPendingNavigation: () => void;
}
```

- **`allowPendingNavigation`**: Call this to proceed with the blocked navigation
- **`cancelPendingNavigation`**: Call this to cancel the blocked navigation

### `guardedNavigateGlobal(navigateFn, path)`

A utility function for programmatic navigation that respects the active navigation guard.

#### Parameters

- `navigateFn: (path: string) => void` - The navigate function from useNavigate()
- `path: string` - The target path to navigate to

### `setGlobalNavigationGuard(guardFn)`

Lower-level function to set the global guard function. Usually handled automatically by `useNavigationGuard`.

#### Parameters

- `guardFn: ((path: string) => boolean) | null` - The guard function or null to remove

## How It Works

The navigation guard works by:

1. **Route Changes**: Intercepting programmatic navigation through a global guard function
2. **Browser Events**: Listening to `beforeunload` events for external navigation
3. **Keyboard Shortcuts**: Capturing F5 and Ctrl+R to handle refresh attempts
4. **State Management**: Managing pending navigation state and providing control functions

## TypeScript Support

This package is written in TypeScript and includes complete type definitions. All interfaces are exported for use in your applications:

```typescript
import type { 
  NavigationGuardOptions, 
  NavigationGuardReturn 
} from 'react-navigation-guard';
```

## Compatibility

- ✅ **React 16.8+** - Full support including latest React 19
- ✅ **React Router 6+** - Optimized for modern React Router
- ✅ **TypeScript 5+** - Complete type safety
- ✅ **Node.js 14+** - Modern build environment

## Best Practices

1. **Keep `shouldBlock` pure**: Make sure this function only depends on state that determines unsaved changes
2. **Handle all navigation types**: Remember to handle both route changes and page reloads in your modal
3. **Provide clear messaging**: Let users know what they'll lose if they navigate away
4. **Test thoroughly**: Test with different navigation methods (back button, direct URL entry, external links)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.