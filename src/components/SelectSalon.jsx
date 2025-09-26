import React from "react";

// Lista de salones (puedes modificar según tu necesidad)
const SALON_OPTIONS = [
"Varela", "Varela II", "Berazategui", "Monteverde", "París",
    "Dream's", "Melody", "Luxor", "Bernal", "Sol Fest",
    "Clahe", "Onix", "Auguri", "Dominico II", "Gala", "Sarandí II",
    "Garufa", "Lomas", "Temperley", "Clahe Escalada", "Piñeyro", "Monte Grande"
];

export default function SelectSalon({ value, onChange, label = "Salón" }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ fontWeight: "600" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "70%", padding: "8px", marginLeft: "10px" }}
      >
        <option value="">Selecciona un salón</option>
        {SALON_OPTIONS.map((salon, idx) => (
          <option key={idx} value={salon}>
            {salon}
          </option>
        ))}
      </select>
    </div>
  );
}