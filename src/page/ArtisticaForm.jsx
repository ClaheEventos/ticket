import React, { useState } from "react";
import CodigoGenerado from "../components/CodigoGenerado";
import PDFPreview from "../components/PDFPreview";
import SelectArea from "../components/SelectArea";
import SelectSalon from "../components/SelectSalon";

export default function PedidoForm() {
  const [formData, setFormData] = useState({
    elementoArtistica: "", // coincidir con doPost
    nombre: "",
    area: "",
    salon: "",
    salonDestinado: "",
    encargado: "",
    dia: "",
    hora: "",
    motivo: "",
    codigo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Generar código
  const handleCodigoGenerado = (codigo) => {
    setFormData(prev => ({ ...prev, codigo }));
  };

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["elementoArtistica", "nombre", "area", "salon", "encargado"];
    const emptyFields = requiredFields.filter(f => !formData[f]?.trim());

    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando formulario...");

    try {
      const url = "https://script.google.com/macros/s/AKfycbyj1JpNezEbVFGJZOWiB6BeX_OdXHv8MpH6BPMFDPY5NWrQvQGjwkZ0guBpKDf-_xDV/exec";
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
        setFormData({
          elementoArtistica: "",
          nombre: "",
          area: "",
          salon: "",
          salonDestinado: "",
          encargado: "",
          dia: "",
          hora: "",
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

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Pedido de Elemento Artístico</h1>

      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        <SelectArea
          value={formData.area}
          onChange={value => setFormData(prev => ({ ...prev, area: value }))}
          label="Área"
        />

        {/* Inputs normales */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Elemento Artística</label>
          <input
            type="text"
            name="elementoArtistica"
            value={formData.elementoArtistica}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Nombre y Apellido</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

        <SelectSalon
          value={formData.salon}
          onChange={value => setFormData(prev => ({ ...prev, salon: value }))}
          label="Salón de origen"
        />
        <SelectSalon
          value={formData.salonDestinado}
          onChange={value => setFormData(prev => ({ ...prev, salonDestinado: value }))}
          label="Salón destino"
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Encargado</label>
          <input
            type="text"
            name="encargado"
            value={formData.encargado}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

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
          <label style={{ fontWeight: "600" }}>Hora</label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivo</label>
          <input
            type="text"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Formulario"}
        </button>
      </form>

      {message && <div style={{ marginTop: "20px", padding: "10px", background: "#e0e0e0", borderRadius: "5px" }}>{message}</div>}

      {submittedData && showPreview && (
        <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}