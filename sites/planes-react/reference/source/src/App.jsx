import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/components/introduction" replace />} />
      <Route path="/components" element={<Layout />} />
      <Route path="/components/*" element={<Layout />} />
      <Route path="/setup" element={<Layout />} />
      <Route path="*" element={<Navigate to="/components/introduction" replace />} />
    </Routes>
  );
}
