import React, { useState } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea"; // componente para sector

export default function AltaPersonalForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    cuil: "",
    sector: "",
    jornada: "",
    fechaIngreso: "",
    sueldo: "",
    alias: "",
    tel: "",
    telAlt: "",
    mail: "",
    puesto: "",
    montoSugerido: "",
    observacion: "",
    codigo: "",
    foto: null,
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nombre",
      "cuil",
      "sector",
      "jornada",
      "fechaIngreso",
      "puesto",
      "codigo",
    ];

    const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      let fotoBase64 = "";
      if (formData.foto) {
        fotoBase64 = await fileToBase64(formData.foto);
      }

      const url =
        "https://script.google.com/macros/s/AKfycbyKLYg_vvXA4OEDC8juXpmuDBHpd_fRcYfzARsaKHeVQ3punfc7H4ajc1B-LC_SCd6ysA/exec";

      const formBody = new URLSearchParams({
        ...formData,
        foto: fotoBase64,
        tipo: "altaPersonal",
      });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Registro guardado correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);
        setFormData({
          nombre: "",
          cuil: "",
          sector: "",
          jornada: "",
          fechaIngreso: "",
          sueldo: "",
          alias: "",
          tel: "",
          telAlt: "",
          mail: "",
          puesto: "",
          montoSugerido: "",
          observacion: "",
          codigo: "",
          foto: null,
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
    { name: "cuil", label: "CUIL" },
    { name: "fechaIngreso", label: "Fecha de Ingreso", type: "date" },
    { name: "sueldo", label: "Sueldo" },
    { name: "alias", label: "Alias" },
    { name: "tel", label: "Teléfono" },
    { name: "telAlt", label: "Tel. Alternativo" },
    { name: "mail", label: "Mail" },
    { name: "puesto", label: "Puesto" },
    { name: "montoSugerido", label: "Monto Sugerido" },
    { name: "observacion", label: "Observación", textarea: true },
  ];

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <h1>Alta de Personal</h1>
      <form onSubmit={handleSubmit}>
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Sector */}
        <SelectArea value={formData.sector} onChange={handleSectorChange} label="Sector" />

        {/* Jornada */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Jornada</label>
          <select
            name="jornada"
            value={formData.jornada}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Completa">Completa</option>
            <option value="Media">Media</option>
            <option value="Reducida">Reducida</option>
          </select>
        </div>

        {/* Otros campos */}
        {campos.map((campo) => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            {campo.textarea ? (
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

        {/* Foto */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Foto</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#e9e9e9", borderRadius: "5px" }}>
          {message}
        </div>
      )}

      {submittedData && showPreview && <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
