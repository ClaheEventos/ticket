import React, { useState } from "react";
import CodigoGenerado from "../components/CodigoGenerado";
import PDFPreview from "../components/PDFPreview";
import SelectArea from "../components/SelectArea"; // Área reutilizable

export default function TransferForm() {
  const [formData, setFormData] = useState({
    area: "",
    nombre: "",
    dispositivo: "",
    numeroSerie: "",
    personaRecibe: "",
    justificacion: "",
    comentarios: "",
    codigo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCodigoGenerado = (codigo) => {
    setFormData(prev => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["area", "nombre", "dispositivo", "numeroSerie", "personaRecibe", "justificacion", "codigo"];
    const emptyFields = requiredFields.filter(f => !formData[f].toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando formulario...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbxa1UbicVcDjkoJSKen_eMFb5FfT_IpKNMHgWpZdgURofyYWjC5iA-Oo-YSWYWpaiY9-Q/exec";
      const formBody = new URLSearchParams(formData);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString()
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Formulario enviado correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        // Reset formulario
        setFormData({
          area: "",
          nombre: "",
          dispositivo: "",
          numeroSerie: "",
          personaRecibe: "",
          justificacion: "",
          comentarios: "",
          codigo: ""
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

  // Lista de dispositivos solo para este formulario
  const DEVICE_OPTIONS = ["Notebook", "Celular"];

  // Campos dinámicos
  const campos = [
    { name: "nombre", label: "Nombre y Apellido" },
    { name: "numeroSerie", label: "Número de Serie del Equipo" },
    { name: "personaRecibe", label: "Persona que Recibe El Equipo" },
    { name: "justificacion", label: "Justificación" },
    { name: "comentarios", label: "Comentarios" }
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Formulario de Traspaso</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Área reutilizable solo para este formulario */}
        <SelectArea
          value={formData.area}
          onChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
          label="Área"
        />

        {/* Dispositivo */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Dispositivo</label>
          <select
            value={formData.dispositivo}
            onChange={(e) => setFormData(prev => ({ ...prev, dispositivo: e.target.value }))}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">Selecciona un dispositivo</option>
            {DEVICE_OPTIONS.map((device, idx) => (
              <option key={idx} value={device}>{device}</option>
            ))}
          </select>
        </div>

        {/* Resto de campos */}
        {campos.map(campo => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            {(campo.name === "justificacion" || campo.name === "comentarios") ? (
              <textarea
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                rows="3"
                style={{ width: "70%", padding: "8px" }}
              />
            ) : (
              <input
                type="text"
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                style={{ width: "70%", padding: "8px" }}
              />
            )}
          </div>
        ))}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Formulario"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#e0e0e0", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
