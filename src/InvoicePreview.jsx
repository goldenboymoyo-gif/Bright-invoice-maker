import { forwardRef } from "react";
import "./InvoicePreview.css";

const InvoicePreview = forwardRef(function InvoicePreview({ invoice, items, serviceSubtotal, maintenanceSubtotal, subtotal, taxAmount, total, signature }, ref) {
  const serviceItems = items.filter((i) => i.type !== "maintenance");
  const maintenanceItems = items.filter((i) => i.type === "maintenance");
  return (
    <div className="invoice-page" ref={ref}>
      <div className="invoice-container">

        <header className="invoice-header">
          <div className="header-left">
            <div className="brand-row">
              <img src="/logo.png" alt="Bright Moyo" className="brand-logo" />
              <div className="brand-text">
                <h1 className="brand-name">Bright Moyo</h1>
                <span className="brand-title">Software Developer</span>
              </div>
            </div>
            <div className="brand-contact">
              <span>brightmoyo125@gmail.com</span>
              <span>+263 774 765 928</span>
              <span>Victoria Falls, Zimbabwe</span>
            </div>
          </div>
          <div className="header-right">
            <h2 className="invoice-heading">INVOICE</h2>
            <div className="invoice-meta">
              <div className="meta-row">
                <span className="meta-label">Invoice #</span>
                <span className="meta-value">{invoice.invoiceNumber || "—"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Date</span>
                <span className="meta-value">{invoice.invoiceDate || "—"}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Due Date</span>
                <span className="meta-value">{invoice.dueDate || "—"}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="divider" />

        <section className="bill-to">
          <span className="section-label">Bill To</span>
          <strong className="bill-to-name">{invoice.clientName || "Client Name"}</strong>
          {invoice.clientEmail && <span>{invoice.clientEmail}</span>}
          {invoice.clientAddress && <span>{invoice.clientAddress}</span>}
        </section>

        <section className="invoice-table">
          <table>
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th className="col-desc">Description</th>
                <th className="col-qty">Qty</th>
                <th className="col-rate">Rate</th>
                <th className="col-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {serviceItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="col-num">{index + 1}</td>
                  <td>{item.description || "—"}</td>
                  <td className="col-qty">{item.quantity}</td>
                  <td className="col-rate">${item.rate.toFixed(2)}</td>
                  <td className="col-amount">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
              {maintenanceItems.length > 0 && (
                <>
                  <tr className="section-divider">
                    <td colSpan="5">
                      <span className="section-tag">Monthly Maintenance</span>
                    </td>
                  </tr>
                  {maintenanceItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="col-num">{serviceItems.length + index + 1}</td>
                      <td>{item.description || "—"}</td>
                      <td className="col-qty">{item.quantity}</td>
                      <td className="col-rate">${item.rate.toFixed(2)}</td>
                      <td className="col-amount">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </section>

        <div className="invoice-footer-grid">
          <div className="invoice-notes">
            {invoice.notes ? (
              <>
                <span className="section-label">Notes</span>
                <p>{invoice.notes}</p>
              </>
            ) : (
              <>
                <span className="section-label">Payment Terms</span>
                <p>Payment due within 30 days of invoice date.</p>
              </>
            )}
          </div>

          <div className="totals-box">
            {serviceSubtotal > 0 && (
              <div className="total-row">
                <span>Services</span>
                <span>${serviceSubtotal.toFixed(2)}</span>
              </div>
            )}
            {serviceSubtotal > 0 && invoice.taxRate > 0 && (
              <div className="total-row">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>${(serviceSubtotal * invoice.taxRate / 100).toFixed(2)}</span>
              </div>
            )}
            {serviceSubtotal > 0 && (
              <div className="total-row total-sub">
                <span>Services Total</span>
                <span>${(serviceSubtotal + serviceSubtotal * invoice.taxRate / 100).toFixed(2)}</span>
              </div>
            )}
            {maintenanceSubtotal > 0 && (
              <>
                <div className="total-row-divider" />
                <div className="total-row">
                  <span>Monthly Maintenance</span>
                  <span>${maintenanceSubtotal.toFixed(2)}</span>
                </div>
                <div className="total-row total-sub">
                  <span>Maintenance Total</span>
                  <span>${maintenanceSubtotal.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="total-row-divider" />
            <div className="total-row total-final">
              <span>Total Due</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <section className="invoice-signature">
          <div className="sig-block">
            <span className="section-label">Signature</span>
            {signature ? (
              <img src={signature} alt="Signature" className="sig-image" />
            ) : (
              <div className="sig-placeholder" />
            )}
            <div className="sig-line" />
            <span className="sig-name">Bright Moyo</span>
            <span className="sig-role">Software Developer</span>
          </div>
        </section>

        <footer className="invoice-footer">
          <div className="footer-divider" />
          <p className="footer-thankyou">Thank you for your business!</p>
          <p className="footer-note">We truly appreciate the opportunity to work with you and look forward to collaborating again in the future. If you have any questions, feel free to reach out.</p>
          <div className="footer-brand">
            <img src="/logo.png" alt="Bright Moyo" className="footer-logo" />
            <span className="footer-name">Bright Moyo</span>
          </div>
        </footer>

      </div>
    </div>
  );
});

export default InvoicePreview;
