// import logo from './logo.svg';
import './App.css';
import Scheduler from './components/Scheduler';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';

import Lists from './components/pages/Lists';
import Makeappointment from './components/pages/Makeappointment';
import Patientappointment from './components/pages/Patientappointment';
import Selectpatient from './components/pages/Selectpatient';
import LoginSignupPage from './components/LoginSignupPage';
function App() {
  return (
    <Router>
    <div className="App">
    <Header/>
    <main style={{ flex: '1', padding: '20px' }}>
    <Routes>
        <Route path="/" element={<Scheduler />} />
        <Route path="/selectpatient" element={<Selectpatient />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/makeappointment" element={<Makeappointment />} />
        <Route path="/patientappointment" element={<Patientappointment />} />
        <Route path="/login" element={<LoginSignupPage />} />
    </Routes>
      </main>
     {/* <Scheduler /> */}
    </div>
    </Router>
  );
}

export default App;
