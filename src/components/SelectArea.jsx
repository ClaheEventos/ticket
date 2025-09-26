import React from "react";

const AREA_OPTIONS = [
  "Área 1",
  "Área 2",
  "Área 3",
  "IT",
  "RRHH",
  "Administración"
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