import React, { useState, useEffect } from "react";
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
    motivo: "",
    codigo: "",
    // CAMBIO 1: Cambiado de 'responsable' a 'nombreUsuario'
    nombreUsuario: "", 
    area: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // CAMBIO 2: Adaptar el useEffect para usar 'nombreUsuario' y 'userEmail' de localStorage
  useEffect(() => {
    // Si nombreUsuario no está definido (o está vacío por el estado inicial o reseteo)
    if (!formData.nombreUsuario) {
      // Usar 'userEmail' como clave, consistente con DesvinculacionForm
      const userEmail = localStorage.getItem("userEmail") || "UsuarioNoDefinido";
      setFormData(prev => ({ ...prev, nombreUsuario: userEmail }));
    }
  }, [formData.nombreUsuario]);

  const handleCodigoGenerado = (codigo) => {
    setFormData(prev => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CAMBIO 3: 'responsable' cambiado por 'nombreUsuario' en los campos obligatorios
    const requiredFields = [
      "ano", "fechaInicio", "fechaFin", "fechaReincorporacion",
      "dias", "nombreApellido", "dni", "correo", "direccion",
      "telefono", "motivo", "nombreUsuario", "codigo", "area",
    ];

    const emptyFields = requiredFields.filter(f => !formData[f]?.toString().trim());
    if (emptyFields.length) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";
      const formBody = new URLSearchParams({ ...formData, tipo: "licenciaEspecial" });

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

        // CAMBIO 4: Resetear formulario manteniendo 'nombreUsuario'
        setFormData(prev => ({
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
          motivo: "",
          codigo: "",
          nombreUsuario: prev.nombreUsuario, // Mantiene el usuario
          area: "",
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
      <h1>Licencia Especial</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Campos visibles */}
        {[
          { label: "Área", name: "area" },
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
          { label: "Motivo", name: "motivo", type: "textarea" },
        ].map(campo => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            {campo.type === "textarea" ? (
              <textarea
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                rows="3"
                style={{ width: "70%", padding: "8px" }}
              />
            ) : (
              <input
                type={campo.type || "text"}
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                style={{ width: "70%", padding: "8px" }}
              />
            )}
          </div>
        ))}

        {/* CAMBIO 5: Campo de nombre de usuario oculto */}
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