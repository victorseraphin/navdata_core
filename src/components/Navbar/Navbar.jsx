import { useEffect, useState } from 'react';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateScreenSize(); // inicial
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
}
