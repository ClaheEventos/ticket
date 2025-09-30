import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";

export default function PermisoExcepcionalForm() {
  const [formData, setFormData] = useState({
    fecha: "",
    nombreApellido: "",
    autorizacion: "",
    motivo: "",
    codigo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCodigoGenerado = (codigo) =>
    setFormData((prev) => ({ ...prev, codigo }));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["fecha", "nombreApellido", "autorizacion", "motivo", "codigo"];
    const emptyFields = requiredFields.filter((f) => !formData[f].toString().trim());

    if (emptyFields.length) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url =
        "https://script.google.com/macros/s/AKfycbwtrhKwfcc_8QHyvKZKUwPOfSGCA60oRRdBPlv4bILRQtW47onA6dquJyNJHgfQQkv0bQ/exec"; // reemplazar con tu Web App

      const formBody = new URLSearchParams({ ...formData, tipo: "permisoExcepcional" });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString()
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Solicitud enviada correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        setFormData({
          fecha: "",
          nombreApellido: "",
          autorizacion: "",
          motivo: "",
          codigo: ""
        });
      } else {
        setMessage(`❌ Error: ${data.mensaje || "No se pudo procesar la solicitud"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error de conexión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <h1>Permiso Excepcional</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Personal/ cargo </label>
          <input type="text" name="nombreApellido" value={formData.nombreApellido} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Autorización</label>
          <input type="text" name="autorizacion" value={formData.autorizacion} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <textarea name="motivo" value={formData.motivo} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && <div style={{ marginTop: "15px" }}>{message}</div>}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
