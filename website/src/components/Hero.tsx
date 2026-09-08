import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1>Glass Jars, Bottles &amp; Decor - Retail &amp; Wholesale</h1>
        <p>
          Airtight storage jars, bottles and mosaic glass aroma lamps. Shop single pieces at
          retail price, or order in bulk at wholesale rates - shipped pan-India.
        </p>
        <div className="hero__actions">
          <Link to="/products" className="btn btn--primary">
            Browse Products
          </Link>
          <Link to="/wholesale" className="btn btn--secondary">
            Wholesale Enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
