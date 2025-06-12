
import NurseNestNavbar from './NurseNestNavbar';

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: NavbarProps) {
  return <NurseNestNavbar isHomePage={isHomePage} />;
}
