import React, { useState } from "react";
import CodigoGenerado from "../components/CodigoGenerado";
import PDFPreview from "../components/PDFPreview";
import SelectArea from "../components/SelectArea"; // Área reutilizable

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    area: "",
    nombre: "",
    telefono: "",
    motivo: "",
    queSeLleva: "",
    cantidad: "",
    dia: "",       // ahora tipo date
    horario: "",   // ahora tipo time
    codigo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCodigoGenerado = (codigo) => {
    setFormData((prev) => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["area","nombre","telefono","motivo","queSeLleva","cantidad","dia","horario","codigo"];
    const emptyFields = requiredFields.filter((f) => !formData[f].toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando formulario...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbyPD_DE43J7Q4ofJqaxeXUK-s9YklcqmSUDDHFTWvwjrfDvLOzvvtBhOgG2kUJkVZiRcg/exec";
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

        setFormData({
          area: "",
          nombre: "",
          telefono: "",
          motivo: "",
          queSeLleva: "",
          cantidad: "",
          dia: "",
          horario: "",
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

  const campos = [
    { name: "nombre", label: "Nombre y Apellido" },
    { name: "telefono", label: "Teléfono" },
    { name: "motivo", label: "Motivo" },
    { name: "queSeLleva", label: "¿Qué se lleva?" },
    { name: "cantidad", label: "Cantidad" }
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Formulario de Registro</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        <SelectArea
          value={formData.area}
          onChange={(value) => setFormData((prev) => ({ ...prev, area: value }))}
          label="Tu Área"
        />

        {campos.map(campo => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            <input
              type={campo.name === "cantidad" ? "number" : "text"}
              name={campo.name}
              value={formData[campo.name]}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px"}}
            />
          </div>
        ))}

        {/* Fecha y hora automáticas */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Día</label>
          <input
            type="date"
            name="dia"
            value={formData.dia}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Horario</label>
          <input
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

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
