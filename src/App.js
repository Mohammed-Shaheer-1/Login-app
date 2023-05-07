import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom';

/**  import all components */
import Username from "./components/Username";
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Profile from './components/Profile';
import Password from './components/Password';
import PageNoteFound from './components/PageNoteFound';

// import axios from 'axios';
/**  root routes */
const router = createBrowserRouter([
    {
        path : '/',
        element : <Username/>
    },
    {
        path : '/register',
        element : <Register/>
    },
    {
        path : '/password',
        element : <Password/>
    },
    {
        path : '/recovery',
        element : <Recovery/>
    },
    {
        path : '/profile',
        element : <Profile/>
    },
    {
        path : '/reset',
        element : <Reset/>
    },
    {
        path : '*',
        element : <PageNoteFound/>
    }
])

function App() {
  return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
  )
}

export default App