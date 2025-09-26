import React from "react";
import { jsPDF } from "jspdf";

export default function PDFDownloader({ data }) {
  const handleDownload = () => {
    const doc = new jsPDF();

    // Logo (opcional)
    const logo = new Image();
    logo.src = "/logo.png";
    logo.onload = () => {
      doc.addImage(logo, "PNG", 80, 10, 50, 20); // Logo centrado

      // Estilo ticket
      doc.setLineWidth(0.5);
      doc.setDrawColor(50);
      doc.line(10, 35, 200, 35); // línea superior tipo ticket
      doc.line(10, 280, 200, 280); // línea inferior tipo ticket

      // Encabezado
      doc.setFontSize(16);
      doc.setFont("courier", "bold");
      doc.text("📄 Solicitud de Dispositivos", 105, 40, { align: "center" });

      // Separador
      doc.setLineWidth(0.2);
      doc.line(10, 45, 200, 45);

      // Datos
      doc.setFont("courier", "normal");
      doc.setFontSize(12);
      let y = 55;
      Object.keys(data).forEach((key) => {
        doc.text(
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data[key]}`,
          20,
          y
        );
        y += 10;

        doc.setDrawColor(200);
        doc.setLineWidth(0.1);
        doc.line(15, y - 5, 190, y - 5);
      });

      // Pie tipo ticket
      doc.setFont("courier", "italic");
      doc.setFontSize(10);
      doc.text(`Código de solicitud: ${data.codigo || "sin-codigo"}`, 105, 285, {
        align: "center",
      });

      doc.save(`Solicitud-${data.codigo || "sin-codigo"}.pdf`);
    };
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      📥 Descargar PDF
    </button>
  );
}