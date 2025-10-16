import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function RenunciaForm() {
  const [formData, setFormData] = useState({
    sector: "",
    nombreApellido: "",
    puesto: "",
    fechaIngreso: "",
    fechaRenuncia: "",
    sueldo: "",
    telefono: "",
    modalidad: "",
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

  const handleSectorChange = (value) => {
    setFormData((prev) => ({ ...prev, sector: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "sector",
      "nombreApellido",
      "puesto",
      "fechaIngreso",
      "fechaRenuncia",
      "sueldo",
      "telefono",
      "modalidad",
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
      const url =
        "https://script.google.com/macros/s/AKfycbzRbX3c1fQynQBSl02SVQDQlSp9_niGQv0bl1ynOZMx6XVOBBSLcMlex8xB3d0qlOSdOQ/exec";
      const formBody = new URLSearchParams({
        ...formData,
        tipo: "renuncia",
      });

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
          sector: "",
          nombreApellido: "",
          puesto: "",
          fechaIngreso: "",
          fechaRenuncia: "",
          sueldo: "",
          telefono: "",
          modalidad: "",
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
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h1>Formulario de Renuncia</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Sector */}
        <SelectArea
          value={formData.sector}
          onChange={handleSectorChange}
          label="Sector"
        />

        {/* Nombre y Apellido */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Apellido y Nombre</label>
          <input
            type="text"
            name="nombreApellido"
            value={formData.nombreApellido}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Puesto */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Puesto</label>
          <input
            type="text"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Fecha de Ingreso */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha de Ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Fecha de Renuncia */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Fecha de Renuncia</label>
          <input
            type="date"
            name="fechaRenuncia"
            value={formData.fechaRenuncia}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Sueldo */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Sueldo</label>
          <input
            type="number"
            name="sueldo"
            value={formData.sueldo}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Teléfono */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        {/* Modalidad */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Modalidad de Contratación</label>
          <select
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="Relación de Dependencia">Relación de Dependencia</option>
            <option value="Monotributo">Monotributo</option>
          </select>
        </div>

        {/* Botón */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#e9e9e9",
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
