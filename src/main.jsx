import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NewContextProvideFunc } from './Context/Context.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <NewContextProvideFunc>
    <App />
  </NewContextProvideFunc>,
)
