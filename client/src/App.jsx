import { Routes, Route} from 'react-router-dom';
import './App.css';
import Account from './pages/account/Account'
import HomePage from './pages/HomePage'
import LibrarianPage from './pages/librarian/LibrarianPage'
import MyBooksPage from './pages/mybooks/mybooks';
import Login from './pages/login/LoginPage'
import OutputPage from './pages/OutputPage'
import UserPage from './pages/user/UserPage'
import BrowseBooks from './pages/browse/browsebooks';





function App() {
  return (
    <Routes>

      {/* Available after logging in */}

        <Route path="/" element={<HomePage/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/user/:userId" element={<UserPage />} /> {/* changed route to include specific ID */}
        <Route path="/browsebooks" element={<BrowseBooks />} />
        <Route path="/output" element={<OutputPage/>} />
        <Route path="/librarian" element={<LibrarianPage/>} />
        <Route path="/mybooks" element={<MyBooksPage/>} />
      {/* when log in take to home or librarian page */}
        <Route path="/login" element={<Login/>} />

    </Routes>
  );
}

export default App;
