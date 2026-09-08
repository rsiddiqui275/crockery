import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function Contact() {
  const message = `Hi ${BUSINESS_NAME}, I have a question about your products.`;

  return (
    <section className="section">
      <h1>Contact Us</h1>
      <div className="contact-grid">
        <div>
          <h3>WhatsApp</h3>
          <p>{WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER}` : 'Set VITE_WHATSAPP_NUMBER in .env'}</p>
          <a
            className="btn btn--primary"
            href={buildWhatsAppLink(WHATSAPP_NUMBER, message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>
        <div>
          <h3>Email</h3>
          <p>hello@crokary.example</p>
        </div>
        <div>
          <h3>Business Hours</h3>
          <p>Mon - Sat, 10:00 AM - 7:00 PM IST</p>
        </div>
      </div>
    </section>
  );
}
