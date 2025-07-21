// Layout.jsx
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
        <Navbar/>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
