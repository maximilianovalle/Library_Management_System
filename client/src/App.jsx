import { Routes, Route} from 'react-router-dom';
import './App.css';
import Account from './pages/account/Account'
import HomePage from './pages/HomePage'
import LibrarianPage from './pages/librarian/LibrarianPage'
import Login from './pages/login/LoginPage'
import OutputPage from './pages/OutputPage'
import UserPage from './pages/UserPage'




function App() {
  return (
    <Routes>

      {/* Available after logging in */}

        <Route path="/" element={<HomePage/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/output" element={<OutputPage/>} />
        <Route path="/librarian" element={<LibrarianPage/>} />

      {/* when log in take to home or librarian page */}
        <Route path="/login" element={<Login/>} />

    </Routes>
  );
}

export default App;
