import React from "react";
import simbolo from "../assets/img/simbolo.jpg"; // ajusta la ruta según tu carpeta

export default function Simbolo({ className = "simbolo-main" }) {
  return (
    <img 
      src={simbolo} 
      alt="Símbolo de la Aplicación" 
      className={className} 
    />
  );
}