import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function CodePDF({ codigo, onClose }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const doc = new jsPDF();

    // Código en grande, centrado
    doc.setFontSize(32);
    doc.setFont("courier", "bold");
    doc.text(codigo || "SIN-CÓDIGO", 105, 150, { align: "center" });

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
          width: "300px",
          maxWidth: "90%",
          background: "#fff",
          borderRadius: "15px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          fontFamily: "'Courier New', Courier, monospace",
          overflow: "hidden",
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
          title="Código PDF Preview"
        />

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `Codigo-${codigo || "SIN-CÓDIGO"}.pdf`;
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
