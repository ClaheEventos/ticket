import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function AumentoSalarialForm() {
  const [formData, setFormData] = useState({
    nombreApellido: "",
    sector: "",
    puesto: "",
    motivo: "",
    cuil: "",
    aumentoSueldoA: "",
    fechaAumento: "",
    proporcional: "",
    fechaInicioProporcional: "",
    responsable: "", // se llena automáticamente
    codigo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Cargar usuario logueado automáticamente
  useEffect(() => {
    const usuarioActual = localStorage.getItem("userEmail") || "Sin usuario";
    setFormData((prev) => ({ ...prev, responsable: usuarioActual }));
  }, []);

  const handleCodigoGenerado = (codigo) => {
    setFormData((prev) => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectorChange = (value) => {
    setFormData((prev) => ({ ...prev, sector: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nombreApellido",
      "sector",
      "puesto",
      "motivo",
      "cuil",
      "aumentoSueldoA",
      "fechaAumento",
      "proporcional",
      "codigo",
      "responsable",
    ];

    const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url =
        "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";

      const formBody = new URLSearchParams({
        ...formData,
        tipo: "aumentoSalarial",
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Solicitud registrada correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        setFormData({
          nombreApellido: "",
          sector: "",
          puesto: "",
          motivo: "",
          cuil: "",
          aumentoSueldoA: "",
          fechaAumento: "",
          proporcional: "",
          fechaInicioProporcional: "",
          responsable: localStorage.getItem("userEmail") || "Sin usuario",
          codigo: "",
        });
      } else {
        setMessage(`❌ Error: ${data.mensaje || "No se pudo procesar la solicitud"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error de conexión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Solicitud de Aumento Salarial</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Nombre y Apellido */}
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

        {/* Sector */}
        <SelectArea value={formData.sector} onChange={handleSectorChange} label="Sector" />

        {/* Puesto */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Puesto</label>
          <input
            type="text"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Motivo */}
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

        {/* CUIL */}
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

        {/* Aumento Sueldo */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Aumento Sueldo</label>
          <input
            type="text"
            name="aumentoSueldoA"
            value={formData.aumentoSueldoA}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Fecha del Aumento */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha del Aumento</label>
          <input
            type="date"
            name="fechaAumento"
            value={formData.fechaAumento}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Proporcional (select con Sí/No) */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>¿Proporcional?</label>
          <select
            name="proporcional"
            value={formData.proporcional}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Fecha solo si elige "Sí" */}
        {formData.proporcional === "Sí" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>Fecha de inicio del aumento proporcional</label>
            <input
              type="date"
              name="fechaInicioProporcional"
              value={formData.fechaInicioProporcional}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        )}

        {/* Responsable oculto */}
        <input type="hidden" name="responsable" value={formData.responsable} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#e9e9e9", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
