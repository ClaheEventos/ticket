// src/components/Logo.jsx
import React from "react";
import logo from "../assets/img/logo.png"; // ajusta la ruta según tu estructura

export default function Logo({ className = "logo-main" }) {
  return (
    <img 
      src={logo} 
      alt="Logo de la Aplicación" 
      className={className} 
    />
  );
} 