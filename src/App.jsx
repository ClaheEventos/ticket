import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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

import Logo from "./components/Logo";
import "./App.css";

/* =======================
   AUTH FETCH GLOBAL
======================= */
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401 || response.status === 403) {

    localStorage.clear();
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  return response;
};

/* =======================
   LOGIN
======================= */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Completá usuario y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://it-b450mhp.tail202065.ts.net//api/jefe/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userEmail", username);

      onLogin();
    } catch {
      setError("No se pudo conectar al servidor");
    } finally {
      setLoading(false);
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

/* =======================
   TRANSICIÓN
======================= */
function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/renuncia" element={<Page><RenunciaForm /></Page>} />
        <Route path="/pedido" element={<Page><LoginAndForm /></Page>} />
        <Route path="/transfer" element={<Page><TransferForm /></Page>} />
        <Route path="/transporte" element={<Page><TransporteForm /></Page>} />
        <Route path="/artistica" element={<Page><ArtisticaForm /></Page>} />

        <Route path="/desvinculacion" element={<Page><DesvinculacionForm /></Page>} />
        <Route path="/altaPersonal" element={<Page><AltaPersonalForm /></Page>} />
        <Route path="/aumentoSalarial" element={<Page><AumentoSalarialForm /></Page>} />
        <Route path="/planilladevacaciones" element={<Page><PlanillaVacacionesForm /></Page>} />
        <Route path="/CambiodePuesto" element={<Page><CambioPuestoForm /></Page>} />
        <Route path="/LicenciaEspecial" element={<Page><LicenciaEspecialForm /></Page>} />
        <Route path="/PermisoExcepcional" element={<Page><PermisoExcepcionalForm /></Page>} />
        <Route path="/CambioDePuestoAVentas" element={<Page><CambioDePuestoAVentasForm /></Page>} />

        <Route path="*" element={<Page><LoginAndForm /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

/* =======================
   APP
======================= */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        await authFetch("https://it-b450mhp.tail202065.ts.net/api/jefe/protegida/");
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const resize = () => window.innerWidth > 768 && setMenuOpen(false);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    window.location.href = "/";
  };

  if (!isAuth) {
    return <LoginPage onLogin={() => setIsAuth(true)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <button onClick={logout} className="logout-button">
            Cerrar sesión
          </button>
        </header>

        <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
          <p className="user">{userEmail}</p>

          <div className="menu">
            <div className="menu-group-title" onClick={() => setOpenGroup(openGroup === "RRHH" ? null : "RRHH")}>
              RRHH
            </div>
            {openGroup === "RRHH" && (
              <>
                <Link to="/desvinculacion">Desvinculación</Link>
                <Link to="/renuncia">Renuncia</Link>
                <Link to="/altaPersonal">Alta Personal</Link>
                <Link to="/aumentoSalarial">Aumento Salarial</Link>
                <Link to="/planilladevacaciones">Vacaciones</Link>
                <Link to="/CambiodePuesto">Cambio Puesto</Link>
                <Link to="/LicenciaEspecial">Licencia</Link>
                <Link to="/PermisoExcepcional">Permiso</Link>
              </>
            )}

            <div className="menu-group-title" onClick={() => setOpenGroup(openGroup === "Choferes" ? null : "Choferes")}>
              Choferes
            </div>
            {openGroup === "Choferes" && <Link to="/transporte">Transporte</Link>}

            <div className="menu-group-title" onClick={() => setOpenGroup(openGroup === "IT" ? null : "IT")}>
              IT
            </div>
            {openGroup === "IT" && (
              <>
                <Link to="/pedido">Pedido</Link>
                <Link to="/transfer">Traspaso</Link>
              </>
            )}
          </div>
        </nav>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div><div></div><div></div>
        </div>

        <div
          className={`sidebar-overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        <main className="main-content">
          <Logo className="logo-main" />
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
