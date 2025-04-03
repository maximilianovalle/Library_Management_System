import { Routes, Route} from 'react-router-dom'
import './App.css';
import Account from './pages/account/Account'
import HomePage from './pages/HomePage'
import LibrarianDashboard from './pages/librarian/LibrarianPage'
import ManageBooks from './pages/librarian/ManageBooks'
import BookForm from './pages/librarian/BookForm'
import ManageDevices from './pages/librarian/ManageDevices'
import DeviceForm from './pages/librarian/DeviceForm'
import UserManagement from './pages/librarian/UserManagement'
import ReportsPage from './pages/librarian/ReportsPage'
import MyBooksPage from './pages/mybooks/mybooks'
import Login from './pages/login/LoginPage'
import BrowseBooks from './pages/browse/browsebooks'
import BrowseDevices from './pages/browse/browsedevices'

function App() {
  return (
    <Routes>
      {/* Default route is now Login */}
      <Route path="/" element={<Login/>} />
      
      {/* Public routes */}
      <Route path="/home" element={<HomePage/>} />
      <Route path="/login" element={<Login/>} />
      
      {/* User routes */}
      <Route path="/account" element={<Account/>} />
      <Route path="/browsebooks" element={<BrowseBooks />} />
      <Route path="/browsedevices" element={<BrowseDevices />} />
      <Route path="/mybooks" element={<MyBooksPage/>} />
      
      {/* Librarian routes */}
      <Route path="/librarian" element={<LibrarianDashboard/>} />
      <Route path="/librarian/manage-books" element={<ManageBooks/>} />
      <Route path="/librarian/manage-books/add" element={<BookForm/>} />
      <Route path="/librarian/manage-books/edit/:isbn" element={<BookForm/>} />
      <Route path="/librarian/manage-devices" element={<ManageDevices/>} />
      <Route path="/librarian/manage-devices/add" element={<DeviceForm/>} />
      <Route path="/librarian/manage-devices/edit/:category/:model/:copyId" element={<DeviceForm/>} />
      <Route path="/librarian/users" element={<UserManagement/>} />
      <Route path="/librarian/reports" element={<ReportsPage/>} />
    </Routes>
  );
}

export default App;