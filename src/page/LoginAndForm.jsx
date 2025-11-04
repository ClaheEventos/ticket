import React, { useState } from "react";
import CodigoGenerado from "../components/CodigoGenerado";
import PDFPreview from "../components/PDFPreview";
import SelectArea from "../components/SelectArea";

export default function DeviceRequestForm() {
  const [formData, setFormData] = useState({
    area: "",
    nombre: "",
    telefono: "",
    dispositivo: "",
    cantidad: "",
    razones: "",
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
    const requiredFields = ["area", "nombre", "telefono", "dispositivo", "cantidad", "razones", "codigo"];
    const emptyFields = requiredFields.filter(f => !formData[f].toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbyOOHch5nNsXQbOATO3Uw_6wO7aHNZnN7QQrJPLylCfSJXTD1VB37dJQnTDw9o1k04t-w/exec"; // tu URL del Web App
      const formBody = new URLSearchParams(formData);

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

        // Reset formulario
        setFormData({
          area: "",
          nombre: "",
          telefono: "",
          dispositivo: "",
          cantidad: "",
          razones: "",
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

  const DEVICE_OPTIONS = ["Notebook", "Celular", "Teclado", "Mouse", "otro"];
  const campos = [
    { name: "nombre", label: "Nombre y Apellido" },
    { name: "telefono", label: "Número Personal" },
    { name: "cantidad", label: "Cantidad" },
    { name: "razones", label: "Razones" },
    { name: "comentarios", label: "Comentarios" }
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Solicitud de Dispositivos</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        <SelectArea
          value={formData.area}
          onChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
          label="Área"
        />

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

        {campos.map((campo) => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            {(campo.name === "razones" || campo.name === "comentarios") ? (
              <textarea
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                rows="3"
                style={{ width: "70%", padding: "8px" }}
              />
            ) : (
              <input
                type={campo.name === "cantidad" ? "number" : "text"}
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                style={{ width: "70%", padding: "8px" }}
              />
            )}
          </div>
        ))}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#e9e9e9ff", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
