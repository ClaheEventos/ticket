import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

import LoginAndForm from "./page/LoginAndForm";
import TransferForm from "./page/TransferForm";
import TransporteForm from "./page/TraspoteFrorm";
import ArtisticaForm from "./page/ArtisticaForm";
import DesvinculacionForm from "./page/rrhh/DesvinculacionForm";
import AltaPersonalForm from "./page/rrhh/AltaPersonalForm";
import AumentoSalarialForm from "./page/rrhh/AumentoSalarialForm";
import AdeleantoSalarialForm from "./page/rrhh/SolicitudAdelantoForm";
import PlanillaVacacionesForm from "./page/rrhh/PlanillaVacacionesForm";
import CambioPuestoForm from "./page/rrhh/CambioPuestoForm";
import LicenciaEspecialForm from "./page/rrhh/LicenciaEspecialForm";
import PermisoExcepcionalForm from "./page/rrhh/PermisoExcepcionalForm";
import "./App.css";
import logo from "./assets/img/logo.png"; // relativa a App.jsx

// Inicializar Supabase
const supabaseUrl = "https://qkvvorfzaugmbgqhynee.supabase.co";
const supabaseAnonKey = "sb_publishable_6r1unwBphp5BC-BMfk-nhg_qA0S5S9K"; // reemplaza con tu clave publicable
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin(data.user.email);
  };

  return (
    <div style={{ textAlign: "center" }}>
<img src={logo} alt="Logo de la Aplicación" className="logo-main" />

      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
       
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        
      />
      <br />
      <button onClick={handleLogin} style={{ padding: "10px 20px", marginTop: "10px" }}>
        Ingresar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    if (userEmail) localStorage.setItem("userEmail", userEmail);
    else localStorage.removeItem("userEmail");

    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userEmail]);

  const closeMenu = () => setMenuOpen(false);
  const handleLogin = (email) => setUserEmail(email);
  const handleLogout = async () => {
    await supabase.auth.signOut();
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
</button>  </header>

  {/* Sidebar */}
  <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
 <p style={{ color: "#ffd700", fontWeight: "bold" }}>
     {userEmail}
    </p>
    <div className="menu">
      <div className="menu-group-title" onClick={() => setOpenGroup(prev => prev === "RRHH" ? null : "RRHH")}>
        RRHH
      </div>
      {openGroup === "RRHH" && (
        <>
          <Link to="/desvinculacion" onClick={closeMenu}>Desvinculación</Link>
          <Link to="/altaPersonal" onClick={closeMenu}>Alta de Personal</Link>
          <Link to="/aumentoSalarial" onClick={closeMenu}>Aumento Salarial</Link>
          <Link to="/adelantoSalarial" onClick={closeMenu}>Adelanto Salarial</Link>
          <Link to="/planilladevacaciones" onClick={closeMenu}>Planilla De Vacaciones</Link>
          <Link to="/CambiodePuesto" onClick={closeMenu}>Cambio De Puesto</Link>
          <Link to="/LicenciaEspecial" onClick={closeMenu}>Licencia Especial</Link>
          <Link to="/PermisoExcepcional" onClick={closeMenu}>Permiso Excepcional</Link>
        </>
            )}

            <div className="menu-group-title" onClick={() => setOpenGroup(prev => prev === "Choferes" ? null : "Choferes")}>
              Choferes
            </div>
            {openGroup === "Choferes" && <Link to="/transporte" onClick={closeMenu}>Pedido De Transporte</Link>}

            <div className="menu-group-title" onClick={() => setOpenGroup(prev => prev === "Artistica" ? null : "Artistica")}>
              Artística
            </div>
            {openGroup === "Artistica" && <Link to="/artistica" onClick={closeMenu}>Pedidos De Artística</Link>}

            <div className="menu-group-title" onClick={() => setOpenGroup(prev => prev === "IT" ? null : "IT")}>
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

        <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`sidebar-overlay ${menuOpen ? "active" : ""}`} onClick={closeMenu}></div>

        <div className="main-content">
          <img src="./src/assets/img/logo.png" alt="Logo de la Aplicación" className="logo-main" />

          <Routes>
            <Route path="/pedido" element={<LoginAndForm />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/transporte" element={<TransporteForm />} />
            <Route path="/artistica" element={<ArtisticaForm />} />
            <Route path="/desvinculacion" element={<DesvinculacionForm />} />
            <Route path="/altaPersonal" element={<AltaPersonalForm />} />
            <Route path="/aumentoSalarial" element={<AumentoSalarialForm />} />
            <Route path="/adelantoSalarial" element={<AdeleantoSalarialForm />} />
            <Route path="/planilladevacaciones" element={<PlanillaVacacionesForm />} />
            <Route path="/CambiodePuesto" element={<CambioPuestoForm />} />
            <Route path="/LicenciaEspecial" element={<LicenciaEspecialForm />} />
            <Route path="/PermisoExcepcional" element={<PermisoExcepcionalForm />} />
            <Route path="/" element={<LoginAndForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
