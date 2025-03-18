import { Routes, Route} from 'react-router-dom';
import './App.css';
import Account from './pages/Account'
import HomePage from './pages/HomePage'
import LibrarianPage from './pages/LibrarianPage'
import Login from './pages/LoginPage'
import OutputPage from './pages/OutputPage'
import UserPage from './pages/UserPage'




function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/output" element={<OutputPage/>} />
        <Route path="/librarian" element={<LibrarianPage/>} />
    </Routes>
  );
}

export default App;
