import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function SolicitudAdelantoForm() {
  const [formData, setFormData] = useState({
    nombreApellido: "",
    cuil: "",
    sector: "",
    monto: "",
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

    const requiredFields = ["nombreApellido", "cuil", "sector", "monto", "codigo"];
    const emptyFields = requiredFields.filter((f) => !formData[f].toString().trim());

    if (emptyFields.length) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbzeO3Z2wKnrTCgsrcvky2n-rK0KCgcD7A7nBl3SAwPsD7XGT5IFoObrFwKsAo9ZPev33Q/exec";

      const formBody = new URLSearchParams({
        ...formData,
        tipo: "adelanto",
        dia: new Date().toISOString().split("T")[0] // Agregamos fecha de envío
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Solicitud enviada correctamente!");
        // Guardamos fecha junto al resto de datos para PDF
        setSubmittedData({ ...formData, dia: new Date().toLocaleDateString() });
        setShowPreview(true);

        setFormData({
          nombreApellido: "",
          cuil: "",
          sector: "",
          monto: "",
          motivo: "",
          codigo: "",
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
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px" }}>
      <h1>Solicitud de Adelanto</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nombre y Apellido</label>
          <input
            type="text"
            name="nombreApellido"
            value={formData.nombreApellido}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>CUIL</label>
          <input
            type="text"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <SelectArea
          value={formData.sector}
          onChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}
          label="Sector"
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Monto</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <textarea
            name="motivo"
            rows="3"
            value={formData.motivo}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "15px", padding: "10px", background: "#e9e9e9", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {submittedData && showPreview && (
        <PDFPreview
          data={submittedData} // Incluye nombreApellido, codigo y dia
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}