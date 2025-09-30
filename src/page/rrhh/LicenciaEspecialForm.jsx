import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";

export default function LicenciaEspecialForm() {
  const [formData, setFormData] = useState({
    ano: "",
    fechaInicio: "",
    fechaFin: "",
    fechaReincorporacion: "",
    dias: "",
    nombreApellido: "",
    dni: "",
    correo: "",
    direccion: "",
    telefono: "",
    nombreJefeArea: "",
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

    const requiredFields = [
      "ano",
      "fechaInicio",
      "fechaFin",
      "fechaReincorporacion",
      "dias",
      "nombreApellido",
      "dni",
      "correo",
      "direccion",
      "telefono",
      "nombreJefeArea",
      "motivo",
      "codigo"
    ];

    const emptyFields = requiredFields.filter(
      (f) => !formData[f].toString().trim()
    );
    if (emptyFields.length) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url =
        "https://script.google.com/macros/s/AKfycbwtrhKwfcc_8QHyvKZKUwPOfSGCA60oRRdBPlv4bILRQtW47onA6dquJyNJHgfQQkv0bQ/exec";

      const formBody = new URLSearchParams({
        ...formData,
        tipo: "licenciaEspecial",
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Solicitud enviada correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        setFormData({
          ano: "",
          fechaInicio: "",
          fechaFin: "",
          fechaReincorporacion: "",
          dias: "",
          nombreApellido: "",
          dni: "",
          correo: "",
          direccion: "",
          telefono: "",
          nombreJefeArea: "",
          motivo: "",
          codigo: ""
        });
      } else {
        setMessage(
          `❌ Error: ${data.mensaje || "No se pudo procesar la solicitud"}`
        );
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
      <h1>Licencia Especial</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {[
          { label: "Año", name: "ano", type: "number" },
          { label: "Fecha Inicio", name: "fechaInicio", type: "date" },
          { label: "Fecha Fin", name: "fechaFin", type: "date" },
          { label: "Fecha Reincorporación", name: "fechaReincorporacion", type: "date" },
          { label: "Cantidad de Días", name: "dias", type: "number" },
          { label: "Nombre y Apellido", name: "nombreApellido" },
          { label: "DNI", name: "dni" },
          { label: "Correo Electrónico", name: "correo", type: "email" },
          { label: "Dirección", name: "direccion" },
          { label: "Teléfono", name: "telefono" },
          { label: "Nombre Jefe de Área", name: "nombreJefeArea" },
        ].map((campo) => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            <input
              type={campo.type || "text"}
              name={campo.name}
              value={formData[campo.name]}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        ))}

        {/* Campo motivo */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <textarea
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            rows="3"
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Registro"}
        </button>
      </form>

      {message && <div style={{ marginTop: "15px" }}>{message}</div>}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}