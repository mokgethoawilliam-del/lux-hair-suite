import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PackingSlipData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  productName: string;
  amount: number;
  date: string;
  storeName: string;
  adminName: string;
  saasName: string;
}

export const generatePackingSlip = (data: PackingSlipData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. HEADER: KasiVault SaaS (Platform Branding)
  doc.setFillColor(15, 17, 23); // Dark background like the app
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(245, 158, 11); // Amber-500
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.saasName, 20, 25);
  
  doc.setTextColor(255, 255, 255, 0.4);
  doc.setFontSize(10);
  doc.text("OFFICIAL VENDOR PACKING SLIP", 20, 32);

  // 2. VENDOR INFO (Store Branding)
  doc.setTextColor(15, 17, 23);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.storeName, 20, 55);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Issued by: ${data.adminName}`, 20, 62);
  doc.text(`Date: ${data.date}`, 20, 67);

  // 3. CUSTOMER / SHIPPING
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 75, pageWidth - 40, 35, "F");
  
  doc.setFont("helvetica", "bold");
  doc.text("DELIVER TO:", 25, 85);
  doc.setFont("helvetica", "normal");
  doc.text(data.customerName, 25, 92);
  doc.text(data.shippingAddress, 25, 97, { maxWidth: pageWidth - 60 });
  doc.text(`Phone: ${data.customerPhone}`, 25, 107);

  // 4. ORDER DETAILS TABLE
  autoTable(doc, {
    startY: 120,
    head: [["Description", "Order ID", "Amount"]],
    body: [
      [data.productName, data.orderId.slice(0, 8), `R ${data.amount}`]
    ],
    headStyles: { fillColor: [15, 17, 23], textColor: [245, 158, 11] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 20, right: 20 }
  });

  // 5. FOOTER
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", pageWidth / 2, finalY, { align: "center" });
  doc.text(`Powered by ${data.saasName} - The Treasury of Mzansi Biz`, pageWidth / 2, finalY + 7, { align: "center" });

  // SAVE
  doc.save(`KasiVault_Slip_${data.orderId.slice(0, 8)}.pdf`);
};
