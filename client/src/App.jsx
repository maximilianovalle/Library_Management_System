import { Routes, Route} from 'react-router-dom'
import './App.css';
import Account from './pages/account/Account'
import HomePage from './pages/HomePage'
import BrowseBooks from './pages/browse/browsebooks'
import BrowseDevices from './pages/browse/browsedevices'
import CheckedOutPage from './pages/checkedOutItems/checkedOut'


import LibrarianDashboard from './pages/librarian/LibrarianPage'
import ManageBooks from './pages/librarian/ManageBooks'
import BookForm from './pages/librarian/BookForm'
import ManageDevices from './pages/librarian/ManageDevices'
import DeviceForm from './pages/librarian/DeviceForm'
import UserManagement from './pages/librarian/UserManagement'
import ReportsPage from './pages/librarian/ReportsPage'
import MyBooksPage from './pages/checkedOutItems/checkedOut'
import Login from './pages/login/LoginPage'
import HoldsPage from './pages/librarian/HoldsPage'
import ManageFinesPage from './pages/librarian/FinesPage'

import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManageLibrarians from './pages/manager/ManageLibrarians';
import ViewLibrarians from './pages/manager/ViewLibrarians';
import ViewReports from './pages/manager/ReportsPage';

// import FinesPage from './pages/librarian/UserManagement'
// import ActivityPage from './pages/librarian/UserManagement'
// import PopularBooksReport from './pages/librarian/UserManagement'
// import OverdueItemsPage from './pages/librarian/UserManagement'


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

      <Route path="/checkedout" element={<CheckedOutPage />}/>
      <Route path="/returnItem" element={<CheckedOutPage/>}/>
      <Route path="/removeHold" element={<CheckedOutPage/>}/>

      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerDashboard/>}/>
      <Route path="/manage-librarians" element={<ManageLibrarians/>}/>
      <Route path="/view-librarians" element={<ViewLibrarians/>}/>
      <Route path="/reports" element={<ViewReports/>}/>

      
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
      <Route path="/librarian/fines" element={<ManageFinesPage/>} />
      <Route path="/librarian/holds" element={<HoldsPage />} />
      {/*  <Route path="/librarian/fines" element={<FinesPage />} />
      <Route path="/librarian/activity" element={<ActivityPage />} />
      <Route path="/librarian/reports/popular-books" element={<PopularBooksReport />} />
      <Route path="/librarian/overdue" element={<OverdueItemsPage />} /> */}

    </Routes>
  );
}

export default App;