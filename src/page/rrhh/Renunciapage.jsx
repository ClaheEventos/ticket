import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";
import SelectArea from "../../components/SelectArea";

export default function RenunciaForm() {
  const [formData, setFormData] = useState({
    // ✅ CLAVES CORREGIDAS Y SIMPLIFICADAS para coincidir con el Appscript
    nombreApellido: "",
    dni: "", // El Appscript espera DNI/CUIL, lo llamaremos 'dni'
    telefono: "", // El Appscript espera Teléfono/Celular, lo llamaremos 'telefono'
    sector: "", // El Appscript espera 'sector'
    modalidad: "", // El Appscript espera 'modalidad'

    fechaRenuncia: "",
    ultimoDiaTrabajado: "",
    fechaIngreso: "",

    puesto: "",
    sueldo: "",
    motivos: "", // Lo dejamos por si quieres enviarlo, aunque no estaba en la lista de 13 campos finales
    
    codigo: "",
    nombreUsuario: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // 🔄 EFECTO: Obtener el usuario logueado al montar el componente
  useEffect(() => {
    if (!formData.nombreUsuario) {
        const userEmail = localStorage.getItem("userEmail") || "UsuarioNoDefinido";
        setFormData((prev) => ({ ...prev, nombreUsuario: userEmail }));
    }
  }, [formData.nombreUsuario]);

  const handleCodigoGenerado = (codigo) => {
    setFormData((prev) => ({ ...prev, codigo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ HANDLER: Cambiado para usar 'sector'
  const handleAreaChange = (value) => {
    setFormData((prev) => ({ ...prev, sector: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 📋 Campos obligatorios (Alineados al Appscript)
    const requiredFields = [
      "fechaRenuncia",
      "ultimoDiaTrabajado",
      "nombreApellido",
      "dni", // Usamos dni en el frontend
      "sector",
      "modalidad",
      "puesto",
      "sueldo",
      "fechaIngreso",
      "codigo",
      "nombreUsuario"
    ];

    const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
    if (emptyFields.length > 0) {
      setMessage(`❌ Completa los campos: ${emptyFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("📤 Enviando solicitud...");

    try {
      // ⚠️ Usamos la URL que has estado usando
      const url = "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";
      
      // ✅ Renombrando las claves de envío para que COINCIDAN con el Apps Script, si es necesario, 
      // aunque el Appscript debería usar los nombres de formData directamente:
      const formBody = new URLSearchParams({ 
        ...formData, 
        tipo: "renuncia",
        // Mapeo directo para claridad:
        cuil: formData.dni,       // El Appscript podría usar 'cuil' o 'dni'
        celular: formData.telefono // El Appscript podría usar 'celular' o 'telefono'
      }); 

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.estado === "ok") {
        setMessage("✅ Solicitud de renuncia registrada correctamente!");
        setSubmittedData(formData);
        setShowPreview(true);

        // Resetear formulario, manteniendo el nombreUsuario
        setFormData(prev => ({
          nombreApellido: "", dni: "", telefono: "", sector: "", modalidad: "",
          fechaRenuncia: "", ultimoDiaTrabajado: "", fechaIngreso: "",
          puesto: "", sueldo: "", motivos: "", codigo: "",
          nombreUsuario: prev.nombreUsuario // Mantiene el usuario
        }));
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
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <h1>Solicitud de Renuncia</h1>

      <form onSubmit={handleSubmit}>
        {/* Generar código */}
        <CodigoGenerado onGenerate={handleCodigoGenerado} />

        {/* Campos de Identificación y Fechas */}
        {[
          { label: "Nombre y Apellido", name: "nombreApellido" },
          { label: "CUIL/DNI", name: "dni" }, // ✅ Usamos 'dni' en el estado
          { label: "Teléfono/Celular", name: "telefono" }, // ✅ Usamos 'telefono' en el estado
          { label: "Fecha de Ingreso", name: "fechaIngreso", type: "date" },
          { label: "Último Día Trabajado", name: "ultimoDiaTrabajado", type: "date" },
          { label: "Fecha de Renuncia", name: "fechaRenuncia", type: "date" },
        ].map((campo) => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            <input
              type={campo.type || "text"}
              name={campo.name} // ✅ Corregido para usar el nombre del estado
              value={formData[campo.name]}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        ))}
        
        {/* Campos de Puesto y Salario */}
        {[
          { label: "Puesto Actual", name: "puesto" },
          { label: "Sueldo", name: "sueldo", type: "number" },
        ].map((campo) => (
          <div key={campo.name} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600" }}>{campo.label}</label>
            <input
              type={campo.type || "text"}
              name={campo.name} // ✅ Corregido para usar el nombre del estado
              value={formData[campo.name]}
              onChange={handleChange}
              style={{ width: "70%", padding: "8px" }}
            />
          </div>
        ))}

        {/* Campo oculto: nombreUsuario */}
        <input type="hidden" name="nombreUsuario" value={formData.nombreUsuario} />

        {/* Área (Sector) */}
        <SelectArea
          value={formData.sector}
          onChange={handleAreaChange}
          label="Área"
        />

        {/* Relación/Modalidad */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Modalidad de Contratación</label>
          <select
            name="modalidad" // ✅ Corregido a 'modalidad' para consistencia con el Appscript
            value={formData.modalidad}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          >
            <option value="">-- Seleccione --</option>
            <option value="Monotributo">Monotributo</option>
            <option value="Dependencia">Dependencia</option>
            <option value="PlazoFijo">Plazo Fijo</option>
          </select>
        </div>

        {/* Motivos (Opcional) */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600" }}>Motivos (Opcional)</label>
          <textarea
            name="motivos"
            rows="3"
            value={formData.motivos}
            onChange={handleChange}
            style={{ width: "70%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "📤 Cargando..." : "Enviar Solicitud"}
        </button>
      </form>

      {/* Mensaje de estado */}
      {message && (
        <div style={{ marginTop: "20px", padding: "10px", background: message.startsWith('❌') ? "#f8d7da" : "#d4edda", borderRadius: "5px" }}>
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