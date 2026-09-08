import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';

export default function Products() {
  const { products, productsLoading } = useStore();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const filtered = categoryParam ? products.filter((p) => p.category === categoryParam) : products;

  return (
    <section className="section">
      <div className="section__header">
        <h1>All Products</h1>
      </div>
      {productsLoading ? <p>Loading products...</p> : <ProductGrid products={filtered} />}
    </section>
  );
}
