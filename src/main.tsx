import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY) throw new Error('NO PUBLISHABLE KEY')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
    > 

    <App />
    </ClerkProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
