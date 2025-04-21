# Cougar Library

Cougar Library is a library management application designed for both users and employees to login and interact with their library. With this application, you can search for specific library items, borrow, place on hold, and return, create and delete item instances, and send notifications to users and employees alike.

Live Website: https://cougarlibraryy.netlify.app/


## Features

### Role-Based Login
Depending on your login credentials, our system can identfy whether you are a 'user', 'librarian', or 'admin' and take you to their respective pages.<br />
<img src="./README_images/1.png" width="400px"> <img src="./README_images/2.png" width="400px"> <img src="./README_images/14.png" width="400px"> <img src="./README_images/15.png" width="400px">

### Return Items
Users are able to not only check out books and place devices on hold, but also return their books and remove their holds on items in our system.<br />
<img src="./README_images/3.png" width="400pxpx"> <img src="./README_images/11.png" width="400px">

### Notification System
Users are able to receive notifications generated automatically by our system and mark them as read.<br />
<img src="./README_images/12.png" width="400pxpx"> <img src="./README_images/13.png" width="400px">

### Catalogue Editing
Users and employees alike are able to browse through our library's extensive catalogue of books and devices. Employees are also able to edit existing items and add or delete new items. <br />
<img src="./README_images/10.png" width="400px"> <img src="./README_images/5.png" width="400px">

### Librarian Functionalities
Librarians can manage user holds, fines, and view reports regarding the data from their library.<br />
<img src="./README_images/6.png" width="400px"> <img src="./README_images/7.png" width="400px">

### Admin Functionalities
Admins can add and edit librarians and users, manage the library catalogue, and edit the status of books currently in maintenance.<br />
<img src="./README_images/8.png" width="400px"> <img src="./README_images/9.png" width="400px">


## Installation & Setup

1. Clone the repository and navigate into the repo folder
```
git clone git@github.com:aadibaahmed/Library_Management_System.git
cd  Library_Management_System
```

2. Setup the backend
```
cd server
npm install

```

3. Setup the frontend
```
cd client
npm install
```
Create a .env file:
```
 REACT_APP_API_URL=http://localhost:8000
```
Then run the app:
```
npm start
```


## Folder Structure

Library_Management_System/<br />
├── client/<br />
│   ├── public/<br />
│   └── src/<br />
├── server/<br />
│   ├── controllers/<br />
│   ├── models/<br />
│   ├── routes/<br />
│   ├── db.js<br />
│   └── server.js<br />
├── README.md<br />
└── README_images<br />


## File Explanation

### Root Directory

- `client`: frontend
- `server`: backend
- `README_images`: images used in README file

### *client* Folder

- `public`: generic index.html
- `src`: frontend components and pages like `Account.jsx`, `DeleteBook.jsx`, and `ManageLibrarians.jsx`

### *server* Folder

- `server.js`: API endpoints
- `database.js`: database connection
- controllers (`add_librarian.js`, `cancel_hold.js`, `borrow_book.js`, etc.): receive input from routes, process data, and respond


## Technology Stack

**Frontend:** React<br />
**Backend:** NodeJS<br />
**Database:** MySQL<br />


## Contributors

| Name  | Github |
| ------------- | ------------- |
| Adiba Ahmed  | [@aadibaahmed](https://github.com/aadibaahmed)  |
| Maximiliano Jesse Ovalle  | [@maximilianovalle](https://github.com/maximilianovalle)  |
| Alan Tony-Itoyah  | [@atonyit](https://github.com/atonyit)  |
| John Gulizia  | [@jguliz](https://github.com/jguliz)  |