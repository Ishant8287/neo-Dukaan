import { useParams, useOutletContext } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Printer, Download } from "lucide-react";

const Invoice = () => {
  const { id } = useParams();
  const { sales = [], shopProfile = {} } = useOutletContext();

  const sale = sales.find((s) => String(s.id) === String(id));

  if (!sale) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50 dark:bg-[#0b1120] font-bold">
        Invoice Not Found
      </div>
    );
  }

  // --- Profile Details ---
  const shopName = shopProfile.name || "NeoDukaan";
  const shopPhone = shopProfile.phone || "+91 00000 00000";
  const shopEmail = shopProfile.email || "hello@neodukaan.com";
  const shopAddress = shopProfile.address || "Shop Address Here";
  const shopLogo = shopProfile.logo || null;
  const shopSignature = shopProfile.signature || null;
  const signatoryName = shopProfile.signatoryName || "Authorized Signatory";
  const designation = shopProfile.designation || "Admin";
  const upiId = shopProfile.upiId || "8287035304@ptyes";

  const payments = sale.payments || {};
  const upiAmount = Number(payments.upi || 0);
  const upiLink =
    upiAmount > 0
      ? `upi://pay?pa=${upiId}&pn=${shopName}&am=${upiAmount}&cu=INR`
      : null;

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text("INVOICE", 150, 25);
      doc.setFontSize(14);
      doc.text(shopName, 14, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      if (shopProfile.gstEnabled && shopProfile.gst)
        doc.text(`GSTIN: ${shopProfile.gst}`, 14, 32);
      doc.text(`Phone: ${shopPhone}`, 14, shopProfile.gstEnabled ? 38 : 32);

      doc.text(`Invoice No: ${sale.invoiceNumber || sale.id}`, 150, 35);
      doc.text(
        `Invoice Date: ${new Date(sale.date).toLocaleDateString("en-IN")}`,
        150,
        40,
      );

      const rows = sale.items.map((item, index) => [
        String(index + 1).padStart(2, "0"),
        item.name,
        `Rs. ${item.sellingPrice}`,
        item.quantity,
        `Rs. ${item.sellingPrice * item.quantity}`,
      ]);

      autoTable(doc, {
        startY: 55,
        head: [["#", "DESCRIPTION", "PRICE", "QUANTITY", "AMOUNT"]],
        body: rows,
        theme: "plain",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: { textColor: [75, 85, 99] },
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "left" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
        },
        alternateRowStyles: { fillColor: [243, 244, 246] },
      });

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 100;

      doc.setFontSize(10);
      doc.text("Sub Total:", 140, finalY + 15);
      doc.text(`Rs. ${sale.totalAmount}`, 175, finalY + 15);

      doc.setFillColor(79, 70, 229); // Indigo 600
      doc.rect(135, finalY + 25, 60, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL", 140, finalY + 32);
      doc.text(`Rs. ${sale.totalAmount}`, 175, finalY + 32);

      doc.save(`${sale.invoiceNumber || sale.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF Download failed. Please check console.");
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#0b1120] min-h-screen p-4 md:p-10 font-sans flex justify-center pb-28">
      {/* INVOICE PAPER*/}
      <div className="bg-white text-slate-900 w-full max-w-4xl shadow-2xl flex flex-col md:min-h-[297mm] print:shadow-none print:w-full">
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start pt-8 px-6 md:pt-16 md:px-12 gap-6">
          <div className="flex flex-col w-full md:w-auto items-center md:items-start">
            {shopLogo ? (
              <img
                src={shopLogo}
                alt="Shop Logo"
                className="h-16 md:h-20 w-auto object-contain mb-2"
              />
            ) : (
              <div className="bg-indigo-600 text-white w-40 md:w-48 p-4 md:p-6 flex flex-col items-center justify-center rounded-br-2xl rounded-tl-2xl">
                <span className="text-2xl md:text-3xl font-black tracking-widest">
                  {shopName.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-[10px] md:text-xs mt-2 tracking-widest font-light text-center">
                  {shopName.toUpperCase()}
                </span>
              </div>
            )}
            {shopProfile.gstEnabled && shopProfile.gst && (
              <p className="mt-3 text-xs font-bold text-slate-500 text-center md:text-left">
                GSTIN: {shopProfile.gst}
              </p>
            )}
          </div>
          <div className="mt-2 md:mt-4 w-full md:w-auto text-center md:text-right">
            <h1 className="text-4xl md:text-6xl font-black tracking-widest text-slate-200 uppercase">
              INVOICE
            </h1>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col sm:flex-row justify-between mt-10 md:mt-16 px-6 md:px-12 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
              Invoice To
            </h3>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Walk-in Customer
            </h2>
            <div className="text-sm text-slate-500 mt-2">Cash Client</div>
          </div>
          <div className="text-sm text-slate-600 grid grid-cols-2 gap-x-4 gap-y-3 text-left sm:text-right">
            <p className="font-bold text-slate-400 uppercase text-xs tracking-wider">
              Invoice No
            </p>
            <p className="font-bold text-slate-900">
              : {sale.invoiceNumber || sale.id}
            </p>
            <p className="font-bold text-slate-400 uppercase text-xs tracking-wider">
              Date
            </p>
            <p className="font-bold text-slate-900">
              : {new Date(sale.date).toLocaleDateString("en-IN")}
            </p>
            <p className="font-bold text-slate-400 uppercase text-xs tracking-wider">
              Payment
            </p>
            <p className="font-bold text-slate-900">
              : {upiAmount > 0 ? "UPI" : "Cash / Udhaar"}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mt-10 md:mt-16 px-4 md:px-12 overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse min-w-125">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs tracking-wider border-y border-slate-300">
              <tr>
                <th className="py-4 w-12 text-center">#</th>
                <th className="py-4 text-left px-4">Description</th>
                <th className="py-4 w-24 text-right">Price</th>
                <th className="py-4 w-20 text-center">Qty</th>
                <th className="py-4 w-28 text-right pr-4">Amount</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              {sale.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-4 text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="py-4 text-left px-4 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-4 text-right">₹{item.sellingPrice}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right pr-4 font-bold text-slate-900">
                    ₹{item.sellingPrice * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY SECTION */}
        <div className="flex flex-col md:flex-row justify-between mt-10 px-6 md:px-12 gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            {upiLink && (
              <div className="mt-2 flex flex-col items-center md:items-start">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">
                  SCAN TO PAY (UPI)
                </p>
                <div className="p-2 border border-slate-200 inline-block rounded-xl bg-white">
                  <QRCodeSVG value={upiLink} size={90} />
                </div>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
            <div className="flex justify-between w-full max-w-62.5 py-3 text-slate-600 font-medium border-b border-slate-100">
              <span>Sub Total</span>
              <span>₹ {sale.totalAmount}</span>
            </div>
            <div className="flex justify-between w-full max-w-62.5 bg-indigo-600 text-white font-black p-4 mt-4 rounded-xl shadow-md">
              <span>TOTAL DUE</span>
              <span>₹ {sale.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-16 pb-8 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 text-center sm:text-left">
          <div className="w-full sm:w-1/2">
            <h4 className="font-bold text-slate-900 mb-2">
              Terms & Conditions
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Payment is due immediately. Goods once sold will not be taken back
              without proper authorization. All disputes are subject to local
              jurisdiction.
            </p>
          </div>
          <div className="text-center w-full sm:w-auto">
            <div className="w-48 h-16 border-b border-slate-300 mx-auto mb-2 relative flex justify-center items-end pb-2">
              {shopSignature ? (
                <img
                  src={shopSignature}
                  alt="Signature"
                  className="max-h-12 w-auto object-contain mix-blend-multiply"
                />
              ) : (
                <span className="text-slate-300 text-xl italic font-serif signature-font">
                  {shopName}
                </span>
              )}
            </div>
            <p className="font-bold text-slate-900">{signatoryName}</p>
            <p className="text-xs text-slate-500">{designation}</p>
          </div>
        </div>

        {/* BOTTOM CONTACT BAR */}
        <div className="w-full bg-slate-50 py-5 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium border-t border-slate-200 gap-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center sm:text-left">
            <span className="flex items-center justify-center sm:justify-start gap-1">
              📞 {shopPhone}
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-1">
              ✉️ {shopEmail}
            </span>
          </div>
          <div className="w-full sm:w-1/2 text-center sm:text-right truncate">
            📍 {shopAddress}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col sm:flex-row gap-3 print:hidden z-50">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3.5 rounded-xl shadow-xl font-bold hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Printer size={18} /> Print
        </button>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-600/30 font-bold hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Download size={18} /> Save PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
