import React from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';

import { Layout} from 'lucide-react'

const Navbar = () => {

   const navigate = useNavigate();
    const [isNavbarHidden, setIsNavbarHidden] = React.useState(false);
    const [isSticky, setIsSticky] = React.useState(false);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Sticky logic
            if (currentScrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }

            // Hide logic
            if (currentScrollY > lastScrollY && currentScrollY > 700) {
                setIsNavbarHidden(true);
            } else {
                setIsNavbarHidden(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);



  return (
    <>
    <nav className={`navbar  ${isSticky ? 'sticky' : ''} ${isNavbarHidden ? 'hidden' : ''}`}>
      <div className="navbar-container">
      <div className='navbar-logo'>
        <Layout className='navbar-logo-icon' color='white' size={40}  />
        <span>IMS Portal</span>
      </div>
      
      
      <div className="nav-links-container">
        <Link className='nav-link' to="/login" >Login</Link>
        <Link to='/signup'><button className='signup-button'>Sign Up</button>
        </Link>
      </div>
    </div>
    </nav>
  </>
  )
}

export default Navbar