import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function LoginPage({ onLogin }) {
  const handleLogin = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    onLogin(decoded.email); // pasa el email a App.jsx
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Inicia sesión con Google</h2>
      <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login fallido")} />
    </div>
  );
}
