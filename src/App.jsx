import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import LoginAndForm from "./page/LoginAndForm";
import TransferForm from "./page/TransferForm";
import TransporteForm from "./page/TraspoteFrorm";
import ArtisticaForm from "./page/ArtisticaForm";
import DesvinculacionForm from "./page/rrhh/DesvinculacionForm";
import AltaPersonalForm from "./page/rrhh/AltaPersonalForm";
import AumentoSalarialForm from "./page/rrhh/AumentoSalarialForm";

import PlanillaVacacionesForm from "./page/rrhh/PlanillaVacacionesForm";
import CambioPuestoForm from "./page/rrhh/CambioPuestoForm";
import LicenciaEspecialForm from "./page/rrhh/LicenciaEspecialForm";
import PermisoExcepcionalForm from "./page/rrhh/PermisoExcepcionalForm";
import RenunciaForm from "./page/rrhh/Renunciapage";
import CambioDePuestoAVentasForm from "./page/rrhh/CambioDePuestoAVentaspage";
import PuestoSelectFrom from "./page/rrhh/PuestoSelectpage";
import "./App.css";

// 👇 Nuevo: importamos el componente Logo
import Logo from "./components/Logo";

// --------------------
// LOGIN COMPONENT
// https://48p82xms-8000.brs.devtunnels.ms/api/jefe/login/
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/jefe/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.detail || "Error al iniciar sesión");
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userEmail", username);
      onLogin(username);
    } catch (err) {
      setError("No se pudo conectar al servidor");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* 👇 usamos el componente Logo */}
      <Logo className="logo-main" />
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", marginTop: "10px" }}
      >
        Ingresar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// --------------------
// MAIN APP
// --------------------
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    if (userEmail) localStorage.setItem("userEmail", userEmail);
    else localStorage.removeItem("userEmail");

    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userEmail]);

  const closeMenu = () => setMenuOpen(false);
  const handleLogin = (email) => setUserEmail(email);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setUserEmail("");
  };

  if (!userEmail) return <LoginPage onLogin={handleLogin} />;

  return (
    <Router>
      <div className="app-container">
        {/* Header arriba */}
        <header className="app-header">
          <button onClick={handleLogout} className="logout-button">
            Cerrar<br />Sesión
          </button>
        </header>

        {/* Sidebar */}
        <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
          <p style={{ color: "#ffd700", fontWeight: "bold" }}>
            {userEmail}
          </p>
          <div className="menu">
            <div
              className="menu-group-title"
              onClick={() => setOpenGroup(prev => prev === "RRHH" ? null : "RRHH")}
            >
              RRHH 
            </div>
            {openGroup === "RRHH" && (
              <>
                <Link to="/desvinculacion" onClick={closeMenu}>Desvinculación</Link>
                <Link to="/renuncia" onClick={closeMenu}>renuncia</Link>
                <Link to="/CambioDePuestoAVentas" onClick={closeMenu}>Cambio Ventas</Link> 
                
                <Link to="/altaPersonal" onClick={closeMenu}>Alta de Personal</Link>
                <Link to="/aumentoSalarial" onClick={closeMenu}>Aumento Salarial</Link>
                <Link to="/planilladevacaciones" onClick={closeMenu}>Planilla De Vacaciones</Link>
                <Link to="/CambiodePuesto" onClick={closeMenu}>Cambio De Puesto</Link>
                <Link to="/LicenciaEspecial" onClick={closeMenu}>Licencia Especial</Link>
                <Link to="/PermisoExcepcional" onClick={closeMenu}>Permiso Excepcional</Link>
              </>
            )}

            <div
              className="menu-group-title"
              onClick={() => setOpenGroup(prev => prev === "Choferes" ? null : "Choferes")}
            >
              Choferes
            </div>
            {openGroup === "Choferes" && (
              <Link to="/transporte" onClick={closeMenu}>Pedido De Transporte</Link>
            )}

            <div
              className="menu-group-title"
              onClick={() => setOpenGroup(prev => prev === "Artistica" ? null : "Artistica")}
            >
              Artística
            </div>
            {openGroup === "Artistica" && (
              <Link to="/artistica" onClick={closeMenu}>Pedidos De Artística</Link>
            )}

            <div
              className="menu-group-title"
              onClick={() => setOpenGroup(prev => prev === "IT" ? null : "IT")}
            >
              IT
            </div>
            {openGroup === "IT" && (
              <>
                <Link to="/pedido" onClick={closeMenu}>Pedido De Dispositivos</Link>
                <Link to="/transfer" onClick={closeMenu}>Traspaso De Dispositivos</Link>
              </>
            )}
          </div>
        </nav>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div
          className={`sidebar-overlay ${menuOpen ? "active" : ""}`}
          onClick={closeMenu}
        ></div>

        <div className="main-content">
          {/* 👇 usamos el componente Logo en vez de img */}
          <Logo className="logo-main" />

          <Routes>
            <Route path="/renuncia" element={<RenunciaForm />} />
            <Route path="/pedido" element={<LoginAndForm />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/transporte" element={<TransporteForm />} />
            <Route path="/artistica" element={<ArtisticaForm />} />
            <Route path="/desvinculacion" element={<DesvinculacionForm />} />
            <Route path="/altaPersonal" element={<AltaPersonalForm />} />
            <Route path="/aumentoSalarial" element={<AumentoSalarialForm />} />
            <Route path="/planilladevacaciones" element={<PlanillaVacacionesForm />} />
            <Route path="/CambiodePuesto" element={<CambioPuestoForm />} />
            <Route path="/LicenciaEspecial" element={<LicenciaEspecialForm />} />
            <Route path="/PermisoExcepcional" element={<PermisoExcepcionalForm />} />
             <Route path="/CambioDePuestoAVentas" element={<CambioDePuestoAVentasForm />} />
             
            <Route path="/" element={<LoginAndForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
