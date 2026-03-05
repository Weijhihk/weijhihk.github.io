import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';
import { PhotoProvider } from './context/PhotoContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PhotoProvider>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </PhotoProvider>
    </BrowserRouter>
  </StrictMode>,
);
