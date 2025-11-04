// src/page/rrhh/CambioPuestoForm.jsx
import React, { useState, useEffect } from "react"; // Importamos useEffect
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function CambioPuestoForm() {
  const [formData, setFormData] = useState({
    sector: "",
    gerente: "",
    fechaSugerida: "",
    dni: "",
    jornadaActual: "",
    nuevaJornada: "",
    motivo: "",
    sueldoAnterior: "",
    sueldoNuevo: "",
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
  }, [formData.nombreUsuario]); 

  const handleCodigoGenerado = (codigo) =>
    setFormData((prev) => ({ ...prev, codigo }));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Manejador de cambio para SelectArea
  const handleSectorChange = (value) => {
    setFormData((prev) => ({ ...prev, sector: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "sector",
      "gerente",
      "fechaSugerida",
      "dni",
      "jornadaActual",
      "nuevaJornada",
      "motivo",
      "sueldoAnterior",
      "sueldoNuevo",
      "codigo",
      // ✅ Campo de usuario obligatorio
      "nombreUsuario" 
    ];

    const emptyFields = requiredFields.filter(
      (f) => !formData[f]?.toString().trim()
    ); // Uso ?. para ser más seguro

    if (emptyFields.length) {
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
        tipo: "cambioPuesto",
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

        // ✅ Resetear formulario manteniendo el nombreUsuario
        setFormData(prev => ({
          sector: "",
          gerente: "",
          fechaSugerida: "",
          dni: "",
          jornadaActual: "",
          nuevaJornada: "",
          motivo: "",
          sueldoAnterior: "",
          sueldoNuevo: "",
          codigo: "",
          nombreUsuario: prev.nombreUsuario // Mantiene el usuario
        }));
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
      <h1>Solicitud Cambio de Puesto</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Usamos SelectArea para elegir el sector */}
        <SelectArea
          value={formData.sector}
          onChange={handleSectorChange} // Usamos el nuevo manejador
          label="Sector"
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nombre y Apellido</label>
          {/* Se usa el nombre de campo 'gerente' pero parece ser el nombre del empleado que cambia de puesto */}
          <input type="text" name="gerente" value={formData.gerente} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha Sugerida</label>
          <input type="date" name="fechaSugerida" value={formData.fechaSugerida} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>CUIL</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Jornada Actual</label>
          <input type="text" name="jornadaActual" value={formData.jornadaActual} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nueva Jornada</label>
          <input type="text" name="nuevaJornada" value={formData.nuevaJornada} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Sueldo Anterior</label>
          <input type="number" name="sueldoAnterior" value={formData.sueldoAnterior} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Sueldo Nuevo</label>
          <input type="number" name="sueldoNuevo" value={formData.sueldoNuevo} onChange={handleChange} style={{ width: "70%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <textarea name="motivo" value={formData.motivo} onChange={handleChange} rows="3" style={{ width: "70%", padding: "8px" }} />
        </div>
        
        {/* ✅ Campo oculto para enviar el nombre del usuario logueado */}
        <input type="hidden" name="nombreUsuario" value={formData.nombreUsuario} /> 

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