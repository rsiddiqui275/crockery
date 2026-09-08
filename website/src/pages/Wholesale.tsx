import { useState } from 'react';
import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function Wholesale() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');

  const message = [
    `Hi ${BUSINESS_NAME}, I'd like a wholesale/bulk quote.`,
    name ? `Name: ${name}` : null,
    phone ? `Phone: ${phone}` : null,
    requirement ? `Requirement: ${requirement}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <section className="section">
      <h1>Wholesale &amp; Bulk Orders</h1>
      <p className="section__lead">
        We supply glass jars, bottles and decor items in bulk to shops, gifting businesses and
        distributors across India. Switch the site to <strong>Wholesale</strong> mode (top right)
        to see bulk pricing and minimum order quantities (MOQ) on every product.
      </p>

      <ul className="info-list">
        <li>Bulk/carton pricing available on every product page</li>
        <li>MOQ (minimum order quantity) shown per product in Wholesale mode</li>
        <li>Pan-India shipping; packed with extra protection for glass</li>
        <li>Custom quantity or mixed-carton requests welcome</li>
      </ul>

      <form
        className="wholesale-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2>Request a Quote</h2>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
        </label>
        <label>
          Requirement
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="e.g. 500ml jars x 200 pcs, monthly supply"
            rows={4}
          />
        </label>
        <a
          className="btn btn--primary"
          href={buildWhatsAppLink(WHATSAPP_NUMBER, message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send Enquiry on WhatsApp
        </a>
      </form>
    </section>
  );
}
