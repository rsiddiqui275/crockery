import { Link, useParams } from 'react-router-dom';
import { useStore, WHATSAPP_NUMBER, BUSINESS_NAME } from '../context/StoreContext';
import { buildWhatsAppLink, formatInr } from '../utils/whatsapp';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, priceMode, addToEnquiry } = useStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="section">
        <p>Product not found.</p>
        <Link to="/products">&larr; Back to products</Link>
      </section>
    );
  }

  const price = priceMode === 'wholesale' ? product.wholesalePrice : product.retailPrice;
  const message = `Hi ${BUSINESS_NAME}, I'm interested in "${product.name}" (${priceMode} pricing, ${formatInr(
    price,
  )} each). Please share availability and next steps.`;

  return (
    <section className="section product-detail">
      <Link to="/products" className="back-link">
        &larr; Back to products
      </Link>
      <div className="product-detail__grid">
        <div className="product-detail__media">
          <img src={product.image} alt={product.name} />
          {product.video && (
            <video src={product.video} controls className="product-detail__video" />
          )}
        </div>
        <div className="product-detail__info">
          <span className="product-card__category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail__meta">
            {[product.sizeMl ? `${product.sizeMl} ml` : null, product.colour, product.material]
              .filter(Boolean)
              .join(' - ')}
          </p>
          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__price">
            {formatInr(price)}
            {priceMode === 'wholesale' && product.moq ? (
              <span className="product-card__moq"> (MOQ {product.moq} pcs)</span>
            ) : null}
          </div>

          <div className="product-detail__actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={!product.inStock}
              onClick={() => addToEnquiry(product)}
            >
              {product.inStock ? 'Add to Enquiry' : 'Out of Stock'}
            </button>
            <a
              className="btn btn--secondary"
              href={buildWhatsAppLink(WHATSAPP_NUMBER, message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
