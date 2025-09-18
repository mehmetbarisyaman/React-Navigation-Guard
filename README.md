# React Navigation Guard

[![npm version](https://badge.fury.io/js/@mehmetbarisyaman%2Freact-navigation-guard.svg)](https://badge.fury.io/js/@mehmetbarisyaman%2Freact-navigation-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

<p align="center">
  <a href="https://iyzi.link/AKRuHg">
    <img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg" alt="Buy Me A Coffee" style="height: 50px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;">
  </a>
</p>

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
npm install @mehmetbarisyaman/react-navigation-guard
```

```bash
yarn add @mehmetbarisyaman/react-navigation-guard
```

```bash
pnpm add @mehmetbarisyaman/react-navigation-guard
```

## Quick Start

```tsx
// App.tsx - Setup Router
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyForm from './MyForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MyForm />
      </div>
    </BrowserRouter>
  );
}

export default App;

// MyForm.tsx - Use the hook
import React, { useState } from 'react';
import { useNavigationGuard } from '@mehmetbarisyaman/react-navigation-guard';

function MyForm() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { allowPendingNavigation, cancelPendingNavigation } = useNavigationGuard({
    shouldBlock: () => hasUnsavedChanges,
    onNavigationAttempt: () => {
      if (window.confirm('You have unsaved changes. Leave anyway?')) {
        allowPendingNavigation();
      } else {
        cancelPendingNavigation();
      }
    }
  });
  
  return (
    <div>
      <input onChange={(e) => setHasUnsavedChanges(e.target.value !== '')} />
      <button onClick={() => setHasUnsavedChanges(false)}>Save</button>
    </div>
  );
}

export default MyForm;
```

## Prerequisites

This package requires:
- **React 16.8.0 or higher** (for hooks support) - **✅ React 19 compatible**
- **react-router-dom 6.0.0 or higher** - **⚠️ REQUIRED: Your component must be wrapped in a Router component**

> **Important:** This hook uses `useNavigate` from react-router-dom, so your component must be inside a `<Router>`, `<BrowserRouter>`, or `<HashRouter>` component.

## Basic Usage

```tsx
// App.tsx - Root component with Router setup
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MyForm from './MyForm';
import OtherPage from './OtherPage';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Form</Link> | <Link to="/other">Other Page</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/other" element={<OtherPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// MyForm.tsx - Component using the navigation guard
import React, { useState } from 'react';
import { useNavigationGuard } from '@mehmetbarisyaman/react-navigation-guard';

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
      <h2>Protected Form</h2>
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
      {hasUnsavedChanges && (
        <p style={{color: 'orange'}}>⚠️ You have unsaved changes!</p>
      )}
      
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <button onClick={handleConfirmLeave}>Leave</button>
            <button onClick={handleCancelLeave} style={{marginLeft: '10px'}}>Stay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyForm;
```

## Advanced Usage

### Global Navigation Control

For cases where you need to control navigation from outside the component:

```tsx
import { guardedNavigateGlobal } from '@mehmetbarisyaman/react-navigation-guard';
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
import { useNavigationGuard } from '@mehmetbarisyaman/react-navigation-guard';

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
} from '@mehmetbarisyaman/react-navigation-guard';
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

## Troubleshooting

### Error: "useNavigate() may be used only in the context of a <Router> component"

This error occurs when your component using `useNavigationGuard` is not wrapped in a Router component. 

**Solution:** Wrap your app in a Router:

```tsx
// ❌ Wrong - No Router wrapper
import MyForm from './MyForm';

function App() {
  return <MyForm />; // This will cause the error
}

// ✅ Correct - Wrapped in Router
import { BrowserRouter } from 'react-router-dom';
import MyForm from './MyForm';

function App() {
  return (
    <BrowserRouter>
      <MyForm />
    </BrowserRouter>
  );
}
```

### Router Options

Choose the appropriate router for your app:

- **`<BrowserRouter>`** - For web apps with server-side routing support
- **`<HashRouter>`** - For static file hosting or when you can't configure server
- **`<MemoryRouter>`** - For testing or non-browser environments

```tsx
// For most web applications
import { BrowserRouter } from 'react-router-dom';

// For static hosting (GitHub Pages, etc.)
import { HashRouter } from 'react-router-dom';

// For testing
import { MemoryRouter } from 'react-router-dom';
```

## Author

Created by **Mehmet Baris Yaman**

Connect with me:
- 💼 **LinkedIn**: [mehmetbarisyaman](https://www.linkedin.com/in/mehmetbarisyaman/)
- 🐦 **X (Twitter)**: [@mbarisyaman](https://x.com/mbarisyaman)
- 🐙 **GitHub**: [mehmetbarisyaman](https://github.com/mehmetbarisyaman)

If this package helped you, feel free to follow me for more React utilities and web development content!

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.