import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function TicketPreview({ codigo, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const doc = new jsPDF();

    // Estilo ticket simple
    doc.setLineWidth(0.5);
    doc.setDrawColor(50);
    doc.line(10, 20, 200, 20); // línea superior
    doc.line(10, 280, 200, 280); // línea inferior

    // Título grande: Ticket
    doc.setFontSize(28);
    doc.setFont("courier", "bold");
    doc.text("🎫 Ticket", 105, 50, { align: "center" });

    // Código destacado
    doc.setFontSize(24);
    doc.setFont("courier", "bold");
    doc.text(codigo || "SIN-CÓDIGO", 105, 100, { align: "center" });

    // Generar blob y URL
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [codigo]);

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
          width: "350px",
          maxWidth: "90%",
          background: "#fff",
          borderRadius: "15px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          fontFamily: "'Courier New', Courier, monospace",
          position: "relative",
          overflow: "hidden",
          border: "2px dashed #2c3e50",
        }}
      >
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
          title="Ticket Preview"
        />

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `Ticket-${codigo || "SIN-CÓDIGO"}.pdf`;
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