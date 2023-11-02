import { Route, Routes } from 'react-router-dom'

import MainLayout from './components/MainLayout/MainLayout'
import RequireAuth from './components/RequireAuth'
import RequireNoAuth from './components/RequireNoAuth'
import Dashboard from './components/Dashboard'
import FormEditor from './components/FormEditor/FormEditor'

import Register from './components/register'
import Login from './components/Login'
import SessionHandler from './components/SessionHandler'

function App() {

  return (
      <Routes>
        <Route element={<SessionHandler />}>
          <Route path='/' element={<MainLayout />}>

            {/* Require No Authentication */}
            <Route element={<RequireNoAuth />}>
              <Route path='register' element={<Register />} />
              <Route path='login' element={<Login />} />
            </Route>
            
            {/* Require Authentication */}
            <Route element={<RequireAuth />}>
              <Route index element={<Dashboard />} />
              <Route path='form/:formId' element={<FormEditor />} />
            </Route>
          </Route>
        </Route>
      </Routes>
  )
}

export default App