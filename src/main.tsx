import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/lora/400.css'
import '@fontsource/lora/500.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
