import { Routes, Route} from 'react-router-dom';
import './App.css';
import Account from './pages/account/Account'
import HomePage from './pages/HomePage'
import LibrarianPage from './pages/librarian/LibrarianPage'
import MyBooksPage from './pages/mybooks/mybooks';
import Login from './pages/login/LoginPage'
import OutputPage from './pages/OutputPage'
// import UserPage from './pages/user/UserPage'
import BrowseBooks from './pages/browse/browsebooks';
import BrowseDevices from './pages/browse/browsedevices';





function App() {
  return (
    <Routes>

      {/* Available after logging in */}

        <Route path="/" element={<HomePage/>} />
        <Route path="/account/:userId" element={<Account/>} />
        {/* <Route path="/user/:userId" element={<UserPage />} /> */}
        <Route path="/browsebooks/:userId" element={<BrowseBooks />} />
        <Route path="/browsedevices/:userId" element={<BrowseDevices />} />
        <Route path="/output" element={<OutputPage/>} />
        <Route path="/librarian" element={<LibrarianPage/>} />
        <Route path="/mybooks/:userId" element={<MyBooksPage/>} />
      {/* when log in take to home or librarian page */}
        <Route path="/login" element={<Login/>} />

    </Routes>
  );
}

export default App;
