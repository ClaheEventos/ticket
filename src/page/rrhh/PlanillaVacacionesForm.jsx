import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";

export default function PlanillaVacacionesForm() {
  const [formData, setFormData] = useState({
    nombreApellido: "",
    dni: "",
    correo: "",
    direccion: "",
    telefono: "",
    anoVacaciones: "",
    fechaInicio: "",
    fechaFin: "",
    fechaReincorporacion: "",
    dias: "",
    nombreJefeArea: "",
    codigo: "",
    // ✅ Campo de usuario agregado
    nombreUsuario: "" 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // ✅ Cargar el nombre de usuario/email automáticamente desde localStorage
  useEffect(() => {
    if (!formData.nombreUsuario) {
      const userEmail = localStorage.getItem("userEmail") || "UsuarioNoDefinido";
      setFormData(prev => ({ ...prev, nombreUsuario: userEmail }));
    }
  }, [formData.nombreUsuario]); // Se ejecuta al montar y al resetear

  const handleCodigoGenerado = (codigo) =>
    setFormData((prev) => ({ ...prev, codigo }));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nombreApellido",
      "dni",
      "correo",
      "direccion",
      "telefono",
      "anoVacaciones",
      "fechaInicio",
      "fechaFin",
      "fechaReincorporacion",
      "dias",
      "nombreJefeArea",
      "codigo",
      // ✅ Campo de usuario obligatorio
      "nombreUsuario" 
    ];
    const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
    if (emptyFields.length) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      // URL mantenida
      const url =
        "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";

      const formBody = new URLSearchParams({ ...formData, tipo: "planillaVacaciones" });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Registro enviado correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        // ✅ Resetear formulario manteniendo el nombreUsuario
        setFormData(prev => ({
          nombreApellido: "",
          dni: "",
          correo: "",
          direccion: "",
          telefono: "",
          anoVacaciones: "",
          fechaInicio: "",
          fechaFin: "",
          fechaReincorporacion: "",
          dias: "",
          nombreJefeArea: "",
          codigo: "",
          nombreUsuario: prev.nombreUsuario // Mantiene el usuario
        }));
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
      <h1>Planilla Vacaciones</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {[
          { label: "Nombre y Apellido", name: "nombreApellido" },
          { label: "DNI", name: "dni" },
          { label: "Correo Electrónico", name: "correo", type: "email" },
          { label: "Dirección", name: "direccion" },
          { label: "Teléfono", name: "telefono" },
          { label: "Año de Vacaciones", name: "anoVacaciones", type: "number" },
          { label: "Fecha Inicio", name: "fechaInicio", type: "date" },
          { label: "Fecha Fin", name: "fechaFin", type: "date" },
          { label: "Fecha Reincorporación", name: "fechaReincorporacion", type: "date" },
          { label: "Cantidad de Días", name: "dias", type: "number" },
          { label: "Nombre Jefe de Área", name: "nombreJefeArea" }
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

        {/* ✅ Campo oculto para enviar el nombre del usuario logueado */}
        <input type="hidden" name="nombreUsuario" value={formData.nombreUsuario} /> 

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