import { useState, useEffect } from "react";

export default function CodigoGenerado({ onGenerate }) {
  const [codigo, setCodigo] = useState("");

  const generarCodigo = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // letras y números
    let nuevoCodigo = "";
    for (let i = 0; i < 6; i++) {
      nuevoCodigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setCodigo(nuevoCodigo);
    if (onGenerate) onGenerate(nuevoCodigo); // lo pasa al padre
  };

  useEffect(() => {
    generarCodigo(); // generar uno al inicio
  }, []);

  return null; // 👈 el input ya no se ve, el usuario no lo visualiza
}