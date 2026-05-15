import { useState, useEffect } from "react";
import "./App.css";

function App() {

  // LOGIN
  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] =
    useState(null);

  // DATOS
  const [usuarios, setUsuarios] =
    useState([]);

  const [asignaciones,
    setAsignaciones] =
    useState([]);

  // NUEVA ASIGNACION
  const [usuarioSeleccionado,
    setUsuarioSeleccionado] =
    useState("");

  const [nuevaParte,
    setNuevaParte] =
    useState("");

  const [nuevaFecha,
    setNuevaFecha] =
    useState("");

  // EDITAR
  const [editandoId,
    setEditandoId] =
    useState(null);

  const [editarParte,
    setEditarParte] =
    useState("");

  const [editarFecha,
    setEditarFecha] =
    useState("");

  // FILTRO
  const [filtroUsuario,
    setFiltroUsuario] =
    useState("todos");

  // NUEVO USUARIO
  const [nuevoNombre,
    setNuevoNombre] =
    useState("");

  const [nuevoUsuario,
    setNuevoUsuario] =
    useState("");

  const [nuevoPassword,
    setNuevoPassword] =
    useState("");

  const [nuevoRol,
    setNuevoRol] =
    useState("miembro");

  // LOGIN
  const login = async () => {

    const respuesta = await fetch(
      "http://localhost:3001/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          usuario,
          password
        })
      }
    );

    if (respuesta.ok) {

      const data =
        await respuesta.json();

      setUser(data);

      if (data.rol === "admin") {

        obtenerTodasAsignaciones();

      } else {

        obtenerAsignaciones(
          data.id
        );
      }

    } else {

      alert(
        "Usuario o contraseña incorrectos"
      );
    }
  };

  // CARGAR USUARIOS
  useEffect(() => {

    fetch(
      "http://localhost:3001/usuarios"
    )
      .then((res) => res.json())

      .then((data) =>
        setUsuarios(data)
      );

  }, []);

  // FECHA
  const formatearFecha = (
    fecha
  ) => {

    return new Date(
      fecha
    ).toLocaleDateString(
      "es-AR"
    );
  };

  // ASIGNACIONES
  const obtenerAsignaciones =
    async (id) => {

      const respuesta =
        await fetch(
          `http://localhost:3001/asignaciones/${id}`
        );

      const data =
        await respuesta.json();

      setAsignaciones(data);
    };

  const obtenerTodasAsignaciones =
    async () => {

      const respuesta =
        await fetch(
          "http://localhost:3001/asignaciones"
        );

      const data =
        await respuesta.json();

      setAsignaciones(data);
    };

  // AGREGAR ASIGNACION
  const agregarAsignacion =
    async () => {

      if (
        !usuarioSeleccionado ||
        !nuevaParte ||
        !nuevaFecha
      ) {

        alert(
          "Completa todos los campos"
        );

        return;
      }

      const nueva = {

        id: Date.now(),

        usuario_id: parseInt(
          usuarioSeleccionado
        ),

        parte: nuevaParte,

        fecha: nuevaFecha
      };

      await fetch(
        "http://localhost:3001/asignaciones",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            nueva
          )
        }
      );

      obtenerTodasAsignaciones();

      setNuevaParte("");

      setNuevaFecha("");

      setUsuarioSeleccionado("");

      alert(
        "Asignación agregada"
      );
    };

  // CREAR USUARIO
  const crearUsuario =
    async () => {

      if (
        !nuevoNombre ||
        !nuevoUsuario ||
        !nuevoPassword
      ) {

        alert(
          "Completa todos los campos"
        );

        return;
      }

      const nuevo = {

        id: Date.now(),

        nombre: nuevoNombre,

        usuario: nuevoUsuario,

        password: nuevoPassword,

        rol: nuevoRol
      };

      const respuesta =
        await fetch(
          "http://localhost:3001/usuarios",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
              nuevo
            )
          }
        );

      if (!respuesta.ok) {

        alert(
          "Ese usuario ya existe"
        );

        return;
      }

      setUsuarios([
        ...usuarios,
        nuevo
      ]);

      setNuevoNombre("");

      setNuevoUsuario("");

      setNuevoPassword("");

      setNuevoRol("miembro");

      alert("Usuario creado");
    };

  // ELIMINAR
  const eliminarAsignacion =
    async (id) => {

      await fetch(
        `http://localhost:3001/asignaciones/${id}`,
        {
          method: "DELETE"
        }
      );

      setAsignaciones(
        asignaciones.filter(
          (a) => a.id !== id
        )
      );
    };

  // EDITAR
  const iniciarEdicion =
    (asignacion) => {

      setEditandoId(
        asignacion.id
      );

      setEditarParte(
        asignacion.parte
      );

      setEditarFecha(
        asignacion.fecha
      );
    };

  const guardarEdicion =
    async (asignacion) => {

      const actualizada = {

        ...asignacion,

        parte: editarParte,

        fecha: editarFecha
      };

      await fetch(
        `http://localhost:3001/asignaciones/${asignacion.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            actualizada
          )
        }
      );

      setAsignaciones(
        asignaciones.map((a) =>
          a.id === asignacion.id
            ? actualizada
            : a
        )
      );

      setEditandoId(null);
    };

  // LOGOUT
  const logout = () => {

    setUser(null);

    setUsuario("");

    setPassword("");

    setAsignaciones([]);
  };

  // FILTRAR
  const asignacionesFiltradas =

    filtroUsuario === "todos"

      ? asignaciones

      : asignaciones.filter(
          (a) =>
            a.usuario_id ===
            parseInt(
              filtroUsuario
            )
        );

  // LOGIN SCREEN
  if (!user) {

    return (
      <div className="login-container">

        <div className="login-card">

          <h2>
            Congregación Chumbicha
          </h2>

          <p>
            Sistema de asignaciones
          </p>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) =>
              setUsuario(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button onClick={login}>
            Ingresar
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="page">

      <div className="header">

        <div>

          <h1>
            Hola {user.nombre} 👋
          </h1>

          <p>
            Bienvenido al sistema
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Salir
        </button>

      </div>

      {user.rol === "admin" && (

        <>
          <div className="admin-panel">

            <h2>
              ➕ Nueva asignación
            </h2>

            <select
              value={
                usuarioSeleccionado
              }

              onChange={(e) =>
                setUsuarioSeleccionado(
                  e.target.value
                )
              }
            >

              <option value="">
                Seleccionar usuario
              </option>

              {usuarios.map((u) => (

                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.nombre}
                </option>

              ))}

            </select>

            <input
              placeholder="Parte"
              value={nuevaParte}
              onChange={(e) =>
                setNuevaParte(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) =>
                setNuevaFecha(
                  e.target.value
                )
              }
            />

            <button
              className="add-btn"
              onClick={
                agregarAsignacion
              }
            >
              ➕ Agregar
            </button>

          </div>

          <div className="admin-panel">

            <h2>
              👥 Crear usuario
            </h2>

            <input
              placeholder="Nombre"
              value={nuevoNombre}
              onChange={(e) =>
                setNuevoNombre(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Usuario"
              value={nuevoUsuario}
              onChange={(e) =>
                setNuevoUsuario(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoPassword}
              onChange={(e) =>
                setNuevoPassword(
                  e.target.value
                )
              }
            />

            <select
              value={nuevoRol}

              onChange={(e) =>
                setNuevoRol(
                  e.target.value
                )
              }
            >

              <option value="miembro">
                Miembro
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

            <button
              className="save-btn"
              onClick={crearUsuario}
            >
              👥 Crear usuario
            </button>

          </div>

          <div className="admin-panel">

            <h2>
              🔎 Filtrar
            </h2>

            <select
              value={filtroUsuario}

              onChange={(e) =>
                setFiltroUsuario(
                  e.target.value
                )
              }
            >

              <option value="todos">
                Todas
              </option>

              {usuarios.map((u) => (

                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.nombre}
                </option>

              ))}

            </select>

          </div>
        </>
      )}

      <h2 className="section-title">
        📅 Asignaciones
      </h2>

      {asignacionesFiltradas.map((a) => (

        <div
          key={a.id}
          className="card"
        >

          {editandoId === a.id ? (

            <>

              <input
                value={editarParte}
                onChange={(e) =>
                  setEditarParte(
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={editarFecha}
                onChange={(e) =>
                  setEditarFecha(
                    e.target.value
                  )
                }
              />

              <button
                className="save-btn"
                onClick={() =>
                  guardarEdicion(a)
                }
              >
                💾 Guardar
              </button>

            </>

          ) : (

            <>

              <h3>
                {a.parte}
              </h3>

              <p>
                📅 {
                  formatearFecha(
                    a.fecha
                  )
                }
              </p>

              <p>
                👤 {
                  (
                    usuarios.find(
                      (u) =>
                        u.id ===
                        a.usuario_id
                    ) || {}
                  ).nombre
                }
              </p>

              {user.rol ===
                "admin" && (

                <>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      iniciarEdicion(a)
                    }
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      eliminarAsignacion(
                        a.id
                      )
                    }
                  >
                    🗑️ Eliminar
                  </button>

                </>

              )}

            </>

          )}

        </div>

      ))}

    </div>
  );
}

export default App;
