import React, { useState } from "react";
import CodigoGenerado from "../components/CodigoGenerado";
import PDFPreview from "../components/PDFPreview";
import SelectArea from "../components/SelectArea";
import SelectSalon from "../components/SelectSalon";

export default function PedidoForm() {
  const [formData, setFormData] = useState({
    elemento: "",
    nombre: "",
    area: "",
    salon: "",
    salonDestinado: "",
    encargado: "",
    dia: "",
    fecha: "",
    motivo: "",
    codigo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Generar código único
  const handleCodigoGenerado = (codigo) => {
    setFormData((prev) => ({ ...prev, codigo }));
  };

  // Manejo general de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter((f) => !formData[f].trim());

    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando formulario...");

    try {
      const url =
        "https://script.google.com/macros/s/AKfycby_FtxPI2FFJ1zJrGz3I5XgHYdTHGpcERZPgmOhf5C8grSCbSuLrT9QPc4S6OspwCUT/exec";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Formulario enviado correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        // Reset formulario
        setFormData({
          elemento: "",
          nombre: "",
          area: "",
          salon: "",
          salonDestinado: "",
          encargado: "",
          dia: "",
          fecha: "",
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

  // Componente de input reutilizable
  const InputField = ({ label, name, value, type = "text" }) => (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ fontWeight: "600" }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Pedido de Elemento Artístico</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Área reutilizable */}
        <SelectArea
          value={formData.area}
          onChange={(value) => setFormData(prev => ({ ...prev, area: value }))}
          label="Área"
        />

        <InputField label="Elemento Artístico" name="elemento" value={formData.elemento} />
        <InputField label="Nombre y Apellido" name="nombre" value={formData.nombre} />

        {/* Salones reutilizables con label dinámico */}
        <SelectSalon
          value={formData.salon}
          onChange={(value) => setFormData(prev => ({ ...prev, salon: value }))}
          label="Salón de origen"
        />
        <SelectSalon
          value={formData.salonDestinado}
          onChange={(value) => setFormData(prev => ({ ...prev, salonDestinado: value }))}
          label="Salón destino"
        />

        <InputField label="Encargado" name="encargado" value={formData.encargado} />
        
        {/* Día y fecha ahora automáticos */}
        <InputField label="Día" name="dia" type="date" value={formData.dia} />
        <InputField label="Fecha" name="fecha" type="time" value={formData.fecha} />

        <InputField label="Motivo del Pedido" name="motivo" value={formData.motivo} />

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
