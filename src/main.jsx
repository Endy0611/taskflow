import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>   {/* 👈 wrap App with Provider */}
         <App />
      </Provider>
  </StrictMode>
)