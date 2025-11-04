import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";

const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input id={name} type={type} name={name} value={value} onChange={onChange} className="form-control" />
    </div>
);

export default function AltaPersonalForm() {
    const [formData, setFormData] = useState({
        fechaIngreso: "", fechaAlta: "", jornada: "",
        nombre: "", cuil: "", sector: "", sueldo: "", alias: "", tel: "", telAlt: "",
        mail: "", puesto: "", montoSugerido: "", observacion: "", foto: "", codigo: "",
        nombreUsuario: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [submittedData, setSubmittedData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const usuarioActual = localStorage.getItem("userEmail") || "Sin usuario";
        setFormData((prev) => ({ ...prev, nombreUsuario: usuarioActual }));
    }, []);

    const handleCodigoGenerado = (codigo) => {
        setFormData((prev) => ({ ...prev, codigo }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ AGREGADO: Convertir imagen a Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                foto: reader.result // Base64 completa "data:image/...;base64,..."
            }));
        };
        reader.readAsDataURL(file);
    };

    // ✅ Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = [
            "nombre", "cuil", "sector", "jornada", "fechaIngreso", "fechaAlta",
            "sueldo", "puesto", "codigo", "nombreUsuario"
        ];

        const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
        if (emptyFields.length > 0) {
            setMessage(`❌ Completa los campos obligatorios: ${emptyFields.join(", ")}`);
            return;
        }

        setIsSubmitting(true);
        setMessage("📤 Enviando solicitud de Alta de Personal...");

        try {
            const url = "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec";
            const formBody = new URLSearchParams({ ...formData, tipo: "altaPersonal" });

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formBody.toString(),
            });

            const data = await res.json();

            if (data.estado === "ok") {
                setMessage("✅ Alta de Personal registrada correctamente!");
                setSubmittedData(formData);
                setShowPreview(true);
                setFormData({
                    fechaIngreso: "", fechaAlta: "", jornada: "", nombre: "", cuil: "",
                    sector: "", sueldo: "", alias: "", tel: "", telAlt: "", mail: "",
                    puesto: "", montoSugerido: "", observacion: "", foto: "", codigo: "",
                    nombreUsuario: localStorage.getItem("userEmail") || "Sin usuario",
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
        <div className="alta-personal-form-container">
            <h1>Formulario de Alta de Personal</h1>
            <form onSubmit={handleSubmit} className="alta-personal-form">
                <CodigoGenerado onGenerate={handleCodigoGenerado} />

                <h3 className="section-title">Fechas y Jornada</h3>
                <InputField label="Fecha de Ingreso a la Empresa" name="fechaIngreso" type="date" value={formData.fechaIngreso} onChange={handleChange} />
                <InputField label="Fecha de Alta Efectiva" name="fechaAlta" type="date" value={formData.fechaAlta} onChange={handleChange} />

                <div className="form-group">
                    <label>Personal Nocturno/Diurno</label>
                    <select name="jornada" value={formData.jornada} onChange={handleChange} className="form-control">
                        <option value="">-- Seleccione Jornada --</option>
                        <option value="Diurno">Diurno</option>
                        <option value="Nocturno">Nocturno</option>
             
                    </select>
                </div>

                <h3 className="section-title">Datos del Empleado</h3>
                <InputField label="Nombre y Apellido" name="nombre" value={formData.nombre} onChange={handleChange} />
                <InputField label="CUIL" name="cuil" value={formData.cuil} onChange={handleChange} />
                <InputField label="Puesto" name="puesto" value={formData.puesto} onChange={handleChange} />
                <InputField label="Sector" name="sector" value={formData.sector} onChange={handleChange} />
                <InputField label="Sueldo Base" name="sueldo" value={formData.sueldo} onChange={handleChange} />
                <InputField label="Monto Sugerido" name="montoSugerido" value={formData.montoSugerido} onChange={handleChange} />

                <h3 className="section-title">Datos de Contacto</h3>
                <InputField label="Email" name="mail" type="email" value={formData.mail} onChange={handleChange} />
                <InputField label="Teléfono" name="tel" value={formData.tel} onChange={handleChange} />
                <InputField label="Teléfono Alternativo" name="telAlt" value={formData.telAlt} onChange={handleChange} />
                <InputField label="Alias" name="alias" value={formData.alias} onChange={handleChange} />

                <h3 className="section-title">Observaciones</h3>
                <textarea name="observacion" rows="3" value={formData.observacion} onChange={handleChange} className="form-control" />

                <h3 className="section-title">Foto de Perfil</h3>
                <input type="file" id="foto" name="foto" onChange={handleFileChange} accept="image/*" className="form-control" />

                <input type="hidden" name="nombreUsuario" value={formData.nombreUsuario} />
                <input type="hidden" name="tipo" value="altaPersonal" />

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? "📤 Registrando..." : "Registrar Alta de Personal"}
                </button>
            </form>

            {message && <div className="message-box">{message}</div>}
            {submittedData && showPreview && (
                <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
            )}
        </div>
    );
}
