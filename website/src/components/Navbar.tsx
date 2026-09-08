import { NavLink } from 'react-router-dom';
import { BUSINESS_NAME, useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenEnquiry: () => void;
}

export default function Navbar({ onOpenEnquiry }: NavbarProps) {
  const { priceMode, setPriceMode, enquiryCount } = useStore();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          {BUSINESS_NAME}
        </NavLink>

        <nav className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            Products
          </NavLink>
          <NavLink to="/wholesale" className={({ isActive }) => (isActive ? 'active' : '')}>
            Wholesale
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contact
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <div className="price-toggle" role="group" aria-label="Pricing mode">
            <button
              type="button"
              className={priceMode === 'retail' ? 'active' : ''}
              onClick={() => setPriceMode('retail')}
            >
              Retail
            </button>
            <button
              type="button"
              className={priceMode === 'wholesale' ? 'active' : ''}
              onClick={() => setPriceMode('wholesale')}
            >
              Wholesale
            </button>
          </div>

          <button type="button" className="enquiry-btn" onClick={onOpenEnquiry}>
            Enquiry
            {enquiryCount > 0 && <span className="enquiry-badge">{enquiryCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
