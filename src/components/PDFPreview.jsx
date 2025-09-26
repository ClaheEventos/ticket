import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function PDFPreview({ data, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const doc = new jsPDF();

    // Logo
    const logo = new Image();
    logo.src = "/logo.png";
    logo.onload = () => {
      doc.addImage(logo, "PNG", 80, 10, 50, 20); // Logo centrado

      // Estilo ticket
      doc.setLineWidth(0.5);
      doc.setDrawColor(50);

      // Borde superior e inferior tipo ticket
      doc.line(10, 35, 200, 35); // línea superior
      doc.line(10, 280, 200, 280); // línea inferior

      // Encabezado
      doc.setFontSize(16);
      doc.setFont("courier", "bold");
      doc.text("📄 Solicitud de Dispositivos", 105, 40, { align: "center" });

      // Separador
      doc.setLineWidth(0.2);
      doc.line(10, 45, 200, 45);

      // Datos tipo ticket
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

        // Línea separadora entre campos
        doc.setDrawColor(200);
        doc.setLineWidth(0.1);
        doc.line(15, y - 5, 190, y - 5);

        // Salto de página si es necesario
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      // Pie tipo ticket
      doc.setFont("courier", "italic");
      doc.setFontSize(10);
      doc.text(
        `Código de solicitud: ${data.codigo || "sin-codigo"}`,
        105,
        285,
        { align: "center" }
      );

      // Generar blob y URL
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url);
    };
  }, [data]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "90%",
          background: "#fff",
          borderRadius: "15px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          fontFamily: "'Courier New', Courier, monospace", // estilo ticket
          position: "relative",
          overflow: "hidden",
          border: "2px dashed #2c3e50",
        }}
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "80px", margin: "0 auto 10px auto" }}
        />

        {/* Vista previa PDF */}
        <iframe
          src={pdfUrl}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "5px",
            marginBottom: "10px",
            background: "#f9f9f9",
          }}
          title="PDF Preview"
        />

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `Solicitud-${data.codigo || "sin-codigo"}.pdf`;
              link.click();
            }}
            style={{
              padding: "10px",
              background: "#2ecc71",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📥 Descargar PDF
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px",
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
