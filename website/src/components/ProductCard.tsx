import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatInr } from '../utils/whatsapp';

export default function ProductCard({ product }: { product: Product }) {
  const { priceMode, addToEnquiry } = useStore();
  const price = priceMode === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-link">
        <img src={product.image} alt={product.name} loading="lazy" />
        {!product.inStock && <span className="badge badge--out">Out of stock</span>}
      </Link>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__meta">
          {[product.sizeMl ? `${product.sizeMl} ml` : null, product.colour]
            .filter(Boolean)
            .join(' - ')}
        </p>
        <div className="product-card__footer">
          <div className="product-card__price">
            {formatInr(price)}
            {priceMode === 'wholesale' && product.moq ? (
              <span className="product-card__moq"> / MOQ {product.moq}</span>
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn--small"
            disabled={!product.inStock}
            onClick={() => addToEnquiry(product)}
          >
            Add to Enquiry
          </button>
        </div>
      </div>
    </article>
  );
}
