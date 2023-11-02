import { Outlet } from 'react-router-dom'
import "./main_layout.css";
import Navbar from '../navbar/navbar';

const MainLayout = () => {

  return (
    <div className='layout-container'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout;