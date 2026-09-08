import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function Home() {
  const { products, productsLoading } = useStore();
  const featured = products.slice(0, 8);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div>
      <Hero />

      <section className="section">
        <div className="section__header">
          <h2>Shop by Category</h2>
        </div>
        <div className="category-pills">
          {categories.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="category-pill">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2>Featured Products</h2>
          <Link to="/products">View all &rarr;</Link>
        </div>

        {productsLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section section--cta">
        <h2>Buying in bulk?</h2>
        <p>Get wholesale pricing and MOQ details for shops, gifting businesses and distributors.</p>
        <Link to="/wholesale" className="btn btn--primary">
          Go to Wholesale Page
        </Link>
      </section>
    </div>
  );
}
