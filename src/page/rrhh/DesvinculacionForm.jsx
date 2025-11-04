// src/page/rrhh/DesvinculacionForm.jsx
import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function DesvinculacionForm() {
  const [formData, setFormData] = useState({
    fechaDesvinculacion: "",
    ultimoDiaTrabajado: "",
    nombreApellido: "",
    cuil: "",
    celular: "",
    area: "",
    relacion: "",
    motivos: "",
    elemento: "",
    comentarioElemento: "",
    codigo: "",
    nombreUsuario: "" // se llenará automáticamente desde localStorage
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Obtener el usuario logueado al montar el componente
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    setFormData((prev) => ({ ...prev, nombreUsuario: userEmail }));
  }, []);

  const handleCodigoGenerado = (codigo) => {
    setFormData((prev) => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (value) => {
    setFormData((prev) => ({ ...prev, area: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Campos obligatorios
    const requiredFields = [
      "fechaDesvinculacion",
      "ultimoDiaTrabajado",
      "nombreApellido",
      "cuil",
      "area",
      "relacion",
      "motivos",
      "elemento",
      "codigo",
      "nombreUsuario"
    ];

    const emptyFields = requiredFields.filter((f) => !formData[f].toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";
      const formBody = new URLSearchParams({ ...formData, tipo: "desvinculacion" });

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

        // Resetear formulario
        setFormData({
          fechaDesvinculacion: "",
          ultimoDiaTrabajado: "",
          nombreApellido: "",
          cuil: "",
          celular: "",
          area: "",
          relacion: "",
          motivos: "",
          elemento: "",
          comentarioElemento: "",
          codigo: "",
          nombreUsuario: localStorage.getItem("userEmail") || ""
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
      <h1>Solicitud de Desvinculación</h1>

      <form onSubmit={handleSubmit}>
        {/* Generar código */}
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Campos visibles */}
        {[
          { label: "Fecha de Desvinculación", name: "fechaDesvinculacion", type: "date" },
          { label: "Último día trabajado", name: "ultimoDiaTrabajado", type: "date" },
          { label: "Nombre y Apellido del Desvinculado", name: "nombreApellido" },
          { label: "CUIL del Desvinculado", name: "cuil" },
          { label: "Celular del Desvinculado", name: "celular" }
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

        {/* Campo oculto: nombreUsuario */}
        <input type="hidden" name="nombreUsuario" value={formData.nombreUsuario} />

        {/* Área */}
        <SelectArea
          value={formData.area}
          onChange={handleAreaChange}
          label="Área"
        />

        {/* Relación */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Relación</label>
          <select
            name="relacion"
            value={formData.relacion}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="Monotributo">Monotributo</option>
            <option value="Dependencia">Dependencia</option>
          </select>
        </div>

        {/* Motivos */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivos</label>
          <textarea
            name="motivos"
            rows="3"
            value={formData.motivos}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Elementos */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Elementos de la Empresa</label>
          <select
            name="elemento"
            value={formData.elemento}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        {formData.elemento === "Sí" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>CUALES DISPOSITIVOS</label>
            <textarea
              name="comentarioElemento"
              rows="2"
              value={formData.comentarioElemento}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {/* Mensaje de estado */}
      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#e9e9e9", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {/* Vista previa PDF */}
      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
