import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../context/StoreContext';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <h3>{BUSINESS_NAME}</h3>
          <p>Retail &amp; wholesale glass jars, bottles and decor - shipped pan-India.</p>
        </div>
        <div>
          <h4>Contact</h4>
          {WHATSAPP_NUMBER ? <p>WhatsApp: +{WHATSAPP_NUMBER}</p> : <p>Set VITE_WHATSAPP_NUMBER in .env</p>}
          <p>Email: hello@crokary.example</p>
        </div>
        <div>
          <h4>Business</h4>
          <p>Retail orders and wholesale/bulk orders both accepted.</p>
        </div>
      </div>
      <p className="footer__copyright">&copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.</p>
    </footer>
  );
}
