import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import './App.css';

export default function App() {
  return (
    <Router>
      <Layout>
        {/* Layout will handle the routing */}
        <Routes>
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/" element={<div></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}
