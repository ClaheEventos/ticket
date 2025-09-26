import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function DesvinculacionForm() {
  const [formData, setFormData] = useState({
    fechaDesvinculacion: "",
    nombreApellido: "",
    cuil: "",
    celular: "",
    area: "",
    relacion: "",
    motivos: "",
    elemento: "",
    comentarioElemento: "",
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

  const handleAreaChange = (value) => {
    setFormData((prev) => ({ ...prev, area: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Campos obligatorios
    const requiredFields = [
      "fechaDesvinculacion",
      "nombreApellido",
      "cuil",
      "area",
      "relacion",
      "motivos",
      "elemento",
      "codigo"
    ];

    const emptyFields = requiredFields.filter((f) => !formData[f].toString().trim());

    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbz_u5fNu4QsBsGkK7acD6zqqFjUm8e6ofj4iTkrzE7lTuzh5C6nmysCeFbgQ1XHUN9e7g/exec";
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

        setFormData({
          fechaDesvinculacion: "",
          nombreApellido: "",
          cuil: "",
          celular: "",
          area: "",
          relacion: "",
          motivos: "",
          elemento: "",
          comentarioElemento: "",
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
      <h1>Solicitud de Desvinculación</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Fecha */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha de Desvinculación</label>
          <input
            type="date"
            name="fechaDesvinculacion"
            value={formData.fechaDesvinculacion}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Nombre y Apellido */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nombre y Apellido Del Desvinculado</label>
          <input
            type="text"
            name="nombreApellido"
            value={formData.nombreApellido}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* CUIL */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>CUIL Del Desvinculado</label>
          <input
            type="text"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Celular */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Celular Del Desvinculado</label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

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

        {/* Elemento Sí / No */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>DISPOSITIVOS DE LA EMPRESA Y OTROS</label>
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

        {/* Comentario sobre el Elemento */}
        {formData.elemento === "Sí" && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>CUALES DISPOSITIVOS </label>
            <textarea
              name="comentarioElemento"
              rows="2"
              value={formData.comentarioElemento}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        )}

        {/* Botón de envío */}
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