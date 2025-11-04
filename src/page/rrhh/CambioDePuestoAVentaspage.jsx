import React, { useState, useEffect } from "react";
import CodigoGenerado from "../../components/CodigoGenerado";
import PDFPreview from "../../components/PDFPreview";

// Lista de equipos de trabajo
const EQUIPOS_DE_TRABAJO = [
    "LUXOR I", "SARANDI III", "TEMPERLEY", "MELODY", "DOMINICO", "DOMINICO II", 
    "DREAM'S", "EQUIPO 11", "GALA", "AVELLANEDA", "EQUIPO 6", "EQUIPO 8", 
    "PARIS", "BERAZATEGUI", "EQUIPO 23", "MANCHESTER", "INTER", "EQUIPO VERDE", 
    "EQUIPO HALCON", "EQUIPO ROSA", "MONTEVERDE", "WILDE III", "VARELA I", 
    "ESCALADA", "MONTE GRANDE", "PINEYRO", "EQUIPO 16", "SARANDI II", "CLAHE", 
    "VARELA II", "ONIX", "BERNAL", "LOMAS DE ZAMORA", "EQUIPO 22"
];

// Opciones de Puesto (Asesor, Jefe, Supervisor)
const PUESTOS_DE_VENTA = ["Asesor", "Jefe", "Supervisor"];

// Componente helper (JSX) para campos de entrada
const InputField = ({ label, name, value, onChange, type = "text" }) => (
<div className="form-group">
<label htmlFor={name}>{label}</label>
<input
 id={name}
 type={type}
 name={name}
 value={value}
 onChange={onChange}
 className="form-control"
 />
</div>
);

// Componente Select reutilizable para Equipos
const EquipoSelect = ({ label, name, value, onChange }) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="form-control"
        >
            <option value="">-- Seleccione un equipo --</option>
            {EQUIPOS_DE_TRABAJO.map(equipo => (
                <option key={equipo} value={equipo}>{equipo}</option>
            ))}
        </select>
    </div>
);

// Componente Select reutilizable para Puestos
const PuestoSelect = ({ label, name, value, onChange }) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="form-control"
        >
            <option value="">-- Seleccione Puesto --</option>
            {PUESTOS_DE_VENTA.map(puesto => (
                <option key={puesto} value={puesto}>{puesto}</option>
            ))}
        </select>
    </div>
);


export default function CambioDePuestoForm() {
    // Definición del estado (useState)
    const [formData, setFormData] = useState({
        nombreApellido: "",
        cuil: "",
        equipoAnterior: "",
        puestoAnterior: "", 
        // 🔑 CAMPOS FALTANTES AÑADIDOS
        fechaIngresoPuestoAnterior: "", // [5]
        supervisorAnterior: "",         // [6]
        salarioAnterior: "",            // [7]
        // 🔑 FIN CAMPOS FALTANTES
        ultimoDiaEquipoAnterior: "",
        equipoNuevo: "",
        puestoNuevo: "",
        fechaInicioNuevoPuesto: "",
        motivo: "",
        codigo: "",
        
        responsable: "",
        responsableAprobador: "", 
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [submittedData, setSubmittedData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Lógica para cargar el usuario logueado (Responsable automático)
    useEffect(() => {
        const usuarioActual = localStorage.getItem("userEmail") || "Sin usuario";
        setFormData((prev) => ({ ...prev, responsable: usuarioActual }));
    }, []);

    const handleCodigoGenerado = (codigo) => {
        setFormData((prev) => ({ ...prev, codigo }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Función de envío (handleSubmit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "nombreApellido", "cuil", "equipoAnterior", "puestoAnterior",
            // 🔑 CAMPOS FALTANTES AÑADIDOS A LA VALIDACIÓN
            "fechaIngresoPuestoAnterior", 
            "supervisorAnterior",
            "salarioAnterior",
            // 🔑 FIN CAMPOS FALTANTES
            "ultimoDiaEquipoAnterior", "equipoNuevo", "puestoNuevo", 
            "fechaInicioNuevoPuesto", "motivo", "codigo", 
            "responsable", 
            "responsableAprobador", 
        ];

        const emptyFields = requiredFields.filter((f) => !formData[f]?.toString().trim());
        if (emptyFields.length > 0) {
            setMessage(`❌ Completa los campos obligatorios: ${emptyFields.join(", ")}`);
            return;
        }

        setIsSubmitting(true);
        setMessage("📤 Enviando solicitud de cambio de puesto...");

        try {
            // Reemplaza con tu URL real
            const url = "https://script.google.com/macros/s/AKfycbzr70JTOGro61-ddRduGFgqxyqj0XoMJ5sF5fuRi3bKOkyPcx7iWBW_sN-HQc93WZp-3A/exec"; 

            const formBody = new URLSearchParams({
                ...formData,
                tipo: "cambioDePuesto",
            });

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formBody.toString(),
            });

            const data = await res.json();

            if (data.estado === "ok") {
                setMessage("✅ Solicitud de cambio de puesto registrada correctamente!");
                setSubmittedData(formData);
                setShowPreview(true);

                // Limpiar el formulario y mantener el responsable
                setFormData({
                    nombreApellido: "", cuil: "", equipoAnterior: "", puestoAnterior: "",
                    fechaIngresoPuestoAnterior: "", supervisorAnterior: "", salarioAnterior: "", // Campos limpios
                    ultimoDiaEquipoAnterior: "", equipoNuevo: "", puestoNuevo: "",
                    fechaInicioNuevoPuesto: "", motivo: "", codigo: "", 
                    responsable: localStorage.getItem("userEmail") || "Sin usuario",
                    responsableAprobador: "",
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

    // La parte que retorna el HTML (JSX puro)
    return (
        <div className="cambio-puesto-form-container">
            <h1>Solicitud de Cambio de Puesto</h1>

            <form onSubmit={handleSubmit} className="cambio-puesto-form">
                <CodigoGenerado onGenerate={handleCodigoGenerado} />

                {/* --- Datos Generales --- */}
                <h3 className="section-title">Datos del Empleado</h3>
                <InputField label="Nombre y Apellido" name="nombreApellido" value={formData.nombreApellido} onChange={handleChange} />
                <InputField label="CUIL" name="cuil" value={formData.cuil} onChange={handleChange} />
                
                {/* Responsable Aprobador (Visible) */}
                <InputField 
                    label="Responsable Aprobador" 
                    name="responsableAprobador" 
                    value={formData.responsableAprobador} 
                    onChange={handleChange} 
                />

                {/* --- Puesto Anterior --- */}
                <h3 className="section-title">Puesto Anterior</h3>
                
                {/* SELECT DE EQUIPO ANTERIOR */}
                <EquipoSelect 
                    label="Equipo Anterior" 
                    name="equipoAnterior" 
                    value={formData.equipoAnterior} 
                    onChange={handleChange} 
                />

                {/* SELECT DE PUESTO ANTERIOR */}
                <PuestoSelect 
                    label="Puesto en Equipo Anterior" 
                    name="puestoAnterior" 
                    value={formData.puestoAnterior} 
                    onChange={handleChange} 
                />

                {/* 🆕 CAMPO FALTANTE 1: FECHA INGRESO PUESTO ANTERIOR */}
                <InputField 
                    label="Fecha de Ingreso al Puesto Anterior" 
                    name="fechaIngresoPuestoAnterior" 
                    type="date" 
                    value={formData.fechaIngresoPuestoAnterior} 
                    onChange={handleChange} 
                />

                {/* 🆕 CAMPO FALTANTE 2: SUPERVISOR ANTERIOR */}
                <InputField 
                    label="Supervisor Anterior" 
                    name="supervisorAnterior" 
                    value={formData.supervisorAnterior} 
                    onChange={handleChange} 
                />

                {/* 🆕 CAMPO FALTANTE 3: SALARIO ANTERIOR */}
                <InputField 
                    label="Salario Base Anterior" 
                    name="salarioAnterior" 
                    type="text" // Usamos text para permitir formatos de moneda
                    value={formData.salarioAnterior} 
                    onChange={handleChange} 
                />

                <InputField label="Último Día en Equipo Anterior" name="ultimoDiaEquipoAnterior" type="date" value={formData.ultimoDiaEquipoAnterior} onChange={handleChange} />

                {/* --- Nuevo Puesto --- */}
                <h3 className="section-title">Nuevo Puesto</h3>
                
                {/* SELECT DE EQUIPO NUEVO */}
                <EquipoSelect 
                    label="Equipo al que Pasa" 
                    name="equipoNuevo" 
                    value={formData.equipoNuevo} 
                    onChange={handleChange} 
                />
                
                {/* SELECT para el Puesto Nuevo (Asesor/Jefe/Supervisor) */}
                <PuestoSelect 
                    label="Puesto en Nuevo Equipo" 
                    name="puestoNuevo" 
                    value={formData.puestoNuevo} 
                    onChange={handleChange} 
                />

                <InputField label="Fecha de Inicio en Nuevo Equipo" name="fechaInicioNuevoPuesto" type="date" value={formData.fechaInicioNuevoPuesto} onChange={handleChange} />

                {/* --- Motivo --- */}
                <h3 className="section-title">Detalle</h3>
                <div className="form-group">
                    <label>Motivo / Observaciones</label>
                    <textarea
                        name="motivo"
                        rows="3"
                        value={formData.motivo}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                {/* Responsable (Automático, oculto) - Quién envía */}
                <input type="hidden" name="responsable" value={formData.responsable} />

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? "📤 Procesando..." : "Registrar Cambio de Puesto"}
                </button>
            </form>

            {message && (
                <div className="message-box">
                    {message}
                </div>
            )}

            {submittedData && showPreview && (
                <PDFPreview data={submittedData} onClose={() => setShowPreview(false)} />
            )}
        </div>
    );
}