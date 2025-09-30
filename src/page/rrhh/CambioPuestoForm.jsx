import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea"; // <-- Importamos SelectArea

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
      "sector",
      "gerente",
      "fechaSugerida",
      "dni",
      "jornadaActual",
      "nuevaJornada",
      "motivo",
      "sueldoAnterior",
      "sueldoNuevo",
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

        setFormData({
          sector: "",
          gerente: "",
          fechaSugerida: "",
          dni: "",
          jornadaActual: "",
          nuevaJornada: "",
          motivo: "",
          sueldoAnterior: "",
          sueldoNuevo: "",
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
      <h1>Solicitud Cambio de Puesto</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Usamos SelectArea para elegir el sector */}
        <SelectArea
          value={formData.sector}
          onChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}
          label="Sector"
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Gerente</label>
          <input type="text" name="gerente" value={formData.gerente} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha Sugerida</label>
          <input type="date" name="fechaSugerida" value={formData.fechaSugerida} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>CUIL</label>
          <input type="text" name="dni" value={formData.dni} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Jornada Actual</label>
          <input type="text" name="jornadaActual" value={formData.jornadaActual} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nueva Jornada</label>
          <input type="text" name="nuevaJornada" value={formData.nuevaJornada} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Sueldo Anterior</label>
          <input type="number" name="sueldoAnterior" value={formData.sueldoAnterior} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Sueldo Nuevo</label>
          <input type="number" name="sueldoNuevo" value={formData.sueldoNuevo} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <textarea name="motivo" value={formData.motivo} onChange={handleChange} rows="3" />
        </div>

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