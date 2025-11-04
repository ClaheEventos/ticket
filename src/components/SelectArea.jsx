import React from "react";

const AREA_OPTIONS = [
"Administración",
"Agendas",
"Ambientación",
"Artística",
"Auditoría",
"Boutique",
"Cocina",
"Compras generales",
"Compras cocinas",
"Directores",
"Electricidad",
"Equipo de coordinación",
"Fotografia",
"Gerentes generales",
"Gerentes de ventas",
"Iluminaria",
"Informatica",
"Jardinería",
"Jefes de área",
"Legales",
"Limpieza",
"Logística",
"Mantenimiento",
"Marketing",
"Monitoreo",
"Obras",
"Pastelería",
"Recaudadores",
"Recursos Humanos",
"Seguridad",
"Serenos",
"Servicio técnico",
"Supervisores de noche",
"Técnica y sonido",
"Ventas"
];

export default function SelectArea({ value, onChange, label = "Área" }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ fontWeight: "600" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "70%", padding: "8px" }}
      >
        <option value="">Selecciona un área</option>
        {AREA_OPTIONS.map((area, index) => (
          <option key={index} value={area}>
            {area}
          </option>
        ))}
      </select>
    </div>
  );
}