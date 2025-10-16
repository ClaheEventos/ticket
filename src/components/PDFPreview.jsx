import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Simbolo from "./simbolo"; // componente React que muestra tu logo

export default function PDFPreview({ data, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!data) return;

    const doc = new jsPDF();

    // Bordes del ticket
    doc.setLineWidth(0.5);
    doc.setDrawColor(50);
    doc.line(10, 20, 200, 20);
    doc.line(10, 280, 200, 280);

    // Título principal
    doc.setFontSize(28);
    doc.setFont("courier", "bold");
    doc.text("TICKET", 105, 40, { align: "center" });

    // Texto introductorio
    doc.setFontSize(14);
    doc.setFont("courier", "normal");
    doc.text("Este es un ticket correspondiente a la fecha indicada,", 105, 65, { align: "center" });
    doc.text("sirve como comprobante de la operación realizada.", 105, 75, { align: "center" });

    // Fecha
    doc.setFontSize(14);
    doc.setFont("courier", "italic");
    doc.text(`Fecha: ${data.dia || "N/D"}`, 105, 95, { align: "center" });

    // Código
    doc.setFontSize(20);
    doc.setFont("courier", "bold");
    doc.text(data.codigo || "SIN-CÓDIGO", 105, 120, { align: "center" });

    // Explicación del código
    doc.setFontSize(12);
    doc.setFont("courier", "normal");
    doc.text("Este código es único y corresponde a tu ticket.", 105, 145, { align: "center" });
    doc.text("Guárdalo ya que será necesario para futuras consultas", 105, 155, { align: "center" });
    doc.text("o verificaciones relacionadas con esta solicitud.", 105, 165, { align: "center" });

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [data]);

  if (!data) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
      alignItems: "center", zIndex: 9999
    }}>
      <div style={{
        width: "400px", maxWidth: "90%", background: "#fff", borderRadius: "15px",
        padding: "20px", display: "flex", flexDirection: "column",
        boxShadow: "0 0 15px rgba(0,0,0,0.4)", fontFamily: "'Courier New', Courier, monospace",
        position: "relative", overflow: "hidden", border: "2px dashed #2c3e50"
      }}>

        {/* Logo / Símbolo arriba */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <Simbolo className="w-20 h-20 mx-auto" />
        </div>

        {/* Vista previa del ticket */}
        <iframe
          src={pdfUrl}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "5px",
            minHeight: "400px",
            background: "#f9f9f9",
            marginBottom: "15px"
          }}
          title="Ticket Preview"
        />

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `Ticket-${data.codigo || "SIN-CÓDIGO"}.pdf`;
              link.click();
            }}
            style={{
              padding: "10px", background: "#2ecc71", color: "#fff",
              border: "none", borderRadius: "5px", cursor: "pointer"
            }}
          >
            📥 Descargar PDF
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px", background: "#e74c3c", color: "#fff",
              border: "none", borderRadius: "5px", cursor: "pointer"
            }}
          >
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}