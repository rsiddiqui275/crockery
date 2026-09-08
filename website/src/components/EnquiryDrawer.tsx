import { useStore, WHATSAPP_NUMBER, BUSINESS_NAME } from '../context/StoreContext';
import { buildWhatsAppLink, formatInr } from '../utils/whatsapp';

export default function EnquiryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { enquiryItems, removeFromEnquiry, setEnquiryQty, clearEnquiry, priceMode } = useStore();

  const total = enquiryItems.reduce((sum, item) => {
    const price = priceMode === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice;
    return sum + price * item.qty;
  }, 0);

  const message = [
    `Hi ${BUSINESS_NAME}, I'd like to enquire about (${priceMode} pricing):`,
    ...enquiryItems.map(
      (item) =>
        `- ${item.product.name} x${item.qty} (${formatInr(
          priceMode === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice,
        )} each)`,
    ),
    `Estimated total: ${formatInr(total)}`,
  ].join('\n');

  return (
    <>
      {open && <div className="drawer__backdrop" onClick={onClose} />}
      <aside className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
        <div className="drawer__header">
          <h2>Your Enquiry</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {enquiryItems.length === 0 ? (
          <p className="empty-state">No items yet. Add products to build an enquiry list.</p>
        ) : (
          <>
            <ul className="drawer__list">
              {enquiryItems.map(({ product, qty }) => (
                <li key={product.id} className="drawer__item">
                  <img src={product.image} alt={product.name} />
                  <div className="drawer__item-body">
                    <p className="drawer__item-name">{product.name}</p>
                    <div className="drawer__item-controls">
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setEnquiryQty(product.id, Number(e.target.value) || 1)}
                      />
                      <button type="button" onClick={() => removeFromEnquiry(product.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__footer">
              <div className="drawer__total">Estimated total: {formatInr(total)}</div>
              <a
                className="btn btn--primary btn--full"
                href={buildWhatsAppLink(WHATSAPP_NUMBER, message)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Send Enquiry on WhatsApp
              </a>
              <button type="button" className="btn btn--ghost btn--full" onClick={clearEnquiry}>
                Clear list
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
