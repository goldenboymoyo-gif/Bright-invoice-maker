import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoicePreview from "./InvoicePreview";
import SignaturePad from "./SignaturePad";
import "./App.css";

const defaultItems = [
  { id: 1, description: "Web Application Development", quantity: 1, rate: 2500.0, type: "service" },
];

const defaultInvoice = {
  invoiceNumber: "INV-001",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  notes: "",
  taxRate: 0,
};

export default function App() {
  const [invoice, setInvoice] = useState(defaultInvoice);
  const [items, setItems] = useState(defaultItems);
  const [signature, setSignature] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef(null);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "description" ? value : Number(value) || 0 }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", quantity: 1, rate: 0, type: "service" },
    ]);
  };

  const addMaintenance = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "Monthly Maintenance", quantity: 1, rate: 0, type: "maintenance" },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const serviceSubtotal = items.filter((i) => i.type !== "maintenance").reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const maintenanceSubtotal = items.filter((i) => i.type === "maintenance").reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = serviceSubtotal * (invoice.taxRate / 100);
  const total = serviceSubtotal + taxAmount;

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    setIsDownloading(true);
    await new Promise((r) => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="app">
      <div className="controls no-print">
        <div className="controls-header">
          <h2>Invoice Generator</h2>
          <p className="subtitle">Create and download professional invoices</p>
        </div>

        <div className="form-section">
          <h3>Invoice Details</h3>
          <div className="form-grid">
            <label>
              Invoice Number
              <input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange} />
            </label>
            <label>
              Invoice Date
              <input type="date" name="invoiceDate" value={invoice.invoiceDate} onChange={handleInvoiceChange} />
            </label>
            <label>
              Due Date
              <input type="date" name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Client Information</h3>
          <div className="form-grid">
            <label>
              Client Name
              <input name="clientName" value={invoice.clientName} onChange={handleInvoiceChange} />
            </label>
            <label>
              Client Email
              <input name="clientEmail" value={invoice.clientEmail} onChange={handleInvoiceChange} />
            </label>
            <label className="full-width">
              Client Address
              <textarea name="clientAddress" value={invoice.clientAddress} onChange={handleInvoiceChange} rows={3} />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Line Items</h3>
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-row">
                <input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  className="item-desc"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  className="item-qty"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
                  className="item-rate"
                  min="0"
                  step="0.01"
                />
                <span className="item-amount">${(item.quantity * item.rate).toFixed(2)}</span>
                {items.length > 1 && (
                  <button className="btn-remove" onClick={() => removeItem(item.id)} title="Remove item">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="add-item-buttons">
            <button className="btn-add" onClick={addItem}>+ Add Item</button>
            <button className="btn-add btn-maintenance" onClick={addMaintenance}>+ Maintenance</button>
          </div>
        </div>

        <div className="form-section">
          <h3>Tax & Notes</h3>
          <div className="form-grid">
            <label>
              Tax Rate (%)
              <input type="number" name="taxRate" value={invoice.taxRate} onChange={handleInvoiceChange} min="0" max="100" step="0.1" />
            </label>
            <div></div>
            <label className="full-width">
              Notes
              <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChange} rows={3} placeholder="Payment terms, bank details, etc." />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Signature</h3>
          <SignaturePad onSignatureChange={setSignature} />
        </div>

        <button className="btn-download" onClick={downloadPDF} disabled={isDownloading}>
          {isDownloading ? (
            <span className="btn-loading">Generating PDF...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      <div className="preview-wrapper">
        <InvoicePreview ref={invoiceRef} invoice={invoice} items={items} serviceSubtotal={serviceSubtotal} maintenanceSubtotal={maintenanceSubtotal} subtotal={subtotal} taxAmount={taxAmount} total={total} signature={signature} />
      </div>
    </div>
  );
}
