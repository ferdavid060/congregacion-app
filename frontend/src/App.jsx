import { useState, useEffect } from "react";
import "./App.css";
import FullCalendar from
"@fullcalendar/react";
import dayGridPlugin from
"@fullcalendar/daygrid";



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
 
const [segundoUsuario,
  setSegundoUsuario] =
  useState("");


  const [nuevaParte,
    setNuevaParte] =
    useState("");
  
 
 const [categoriaSeleccionada,
  setCategoriaSeleccionada] =
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
  

  const [usuarioGestion,
    setUsuarioGestion] =
   useState("");


 const [eventoSeleccionado,
  setEventoSeleccionado] =
  useState(null);


 const categorias = {

  "Entre semana": [
    "Lectura bíblica",
    "Perlas escondidas",
    "Estudiante",
    "Empiece conversaciones",
    "Haga revisitas",
    "Haga discípulos",
    "Explique sus creencias",
    "Discurso",
    "Oración"
  ],

  "Fin de semana": [
    "Presidente",
    "Lectura",
    "Oración final"
  ],

  "Audio y video": [
    "Consola",
    "Micrófonos",
    "Zoom"
  ],

  "Acomodadores": [
    "Entrada",
    "Estacionamiento",
    "Salón"
  ]
   };


  // LOGIN
  const login = async () => {

    const respuesta = await fetch(
      "https://congregacion-app.onrender.com/login",
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
      "https://congregacion-app.onrender.com/usuarios"
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
          `https://congregacion-app.onrender.com/asignaciones/${id}`
        );

      const data =
        await respuesta.json();

      setAsignaciones(data);
    };

  const obtenerTodasAsignaciones =
    async () => {

      const respuesta =
        await fetch(
          "https://congregacion-app.onrender.com/asignaciones"
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
     
   // VERIFICAR REPETICION

   const repetida =
   asignaciones.find((a) => {

    // NUEVA FECHA
    const nuevaFechaObj =
      new Date(nuevaFecha);

    // FECHA EXISTENTE
    const fechaExistente =
      new Date(a.fecha);

    // MISMO MES
    const mismoMes =

      nuevaFechaObj.getMonth() ===
      fechaExistente.getMonth()

      &&

      nuevaFechaObj.getFullYear() ===
      fechaExistente.getFullYear();

    // USUARIO INCLUIDO
    const mismoUsuario =

      a.usuarios_ids

        ? a.usuarios_ids.includes(
            parseInt(
              usuarioSeleccionado
            )
          )

        : a.usuario_id ===
          parseInt(
            usuarioSeleccionado
          );

    // MISMA TAREA
    const mismaParte =
      a.parte === nuevaParte;

    return (
      mismoMes &&
      mismoUsuario &&
      mismaParte
    );
  });

if (repetida) {

  alert(
    "⚠️ Este usuario ya tiene esta asignación este mes"
  );
  }


      const nueva = {

        id: Date.now(),

        
     usuarios_ids: segundoUsuario

  ? [
      parseInt(
        usuarioSeleccionado
      ),

      parseInt(
        segundoUsuario
      )
    ]

  : [
      parseInt(
        usuarioSeleccionado
      )
    ],



        parte: nuevaParte,

        fecha: nuevaFecha
      };

      await fetch(
        "https://congregacion-app.onrender.com/asignaciones",
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

  // ELIMINAR USUARIO
const eliminarUsuario =
  async (id) => {

    if (id === user.id) {

      alert(
        "No puedes eliminarte a ti mismo"
      );

      return;
    }

    await fetch(
      `https://congregacion-app.onrender.com/usuarios/${id}`,
      {
        method: "DELETE"
      }
    );

    setUsuarios(
      usuarios.filter(
        (u) => u.id !== id
      )
    );

    setAsignaciones(
      asignaciones.filter((a) => {

        if (a.usuarios_ids) {

          return !a.usuarios_ids.includes(id);
        }

        return a.usuario_id !== id;
      })
    );

    alert("Usuario eliminado");
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
        "https://congregacion-app.onrender.com/usuarios",
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
        `https://congregacion-app.onrender.com/asignaciones/${id}`,
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
        `https://congregacion-app.onrender.com/asignaciones/${asignacion.id}`,
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
  
  
  
 const eventosCalendario =

  asignacionesFiltradas.map(
    (a) => ({

      title:

        `${a.parte} - ` +

        (

          a.usuarios_ids

            ? a.usuarios_ids
                .map((id) => {

                  return usuarios.find(
                    (u) =>
                      u.id === id
                  )?.nombre;
                })

                .join(" + ")

            : usuarios.find(
                (u) =>
                  u.id ===
                  a.usuario_id
              )?.nombre
        ),

      date: a.fecha,

      extendedProps: {
        asignacion: a
      }

    })
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
           
            <select
  value={segundoUsuario}

  onChange={(e) =>
    setSegundoUsuario(
      e.target.value
    )
  }
>

  <option value="">
    Segundo usuario (opcional)
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


            
            <select
           value={
              categoriaSeleccionada
               }

          onChange={(e) => {

         setCategoriaSeleccionada(
          e.target.value
         );

            setNuevaParte("");
       }}
      > 

  <option value="">
    Seleccionar categoría
  </option>

  {Object.keys(categorias)
    .map((cat) => (

      <option
        key={cat}
        value={cat}
      >
        {cat}
      </option>

  ))}
</select>

{categoriaSeleccionada && (

  <select
    value={nuevaParte}

    onChange={(e) =>
      setNuevaParte(
        e.target.value
      )
    }
  >

    <option value="">
      Seleccionar tarea
    </option>

    {
      categorias[
        categoriaSeleccionada
      ].map((tarea) => (

        <option
          key={tarea}
          value={tarea}
        >
          {tarea}
        </option>

      ))
     }

      </select>
      )}


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
       👥 Gestionar usuario
       </h2>

        <select
         value={usuarioGestion}

        onChange={(e) =>
       setUsuarioGestion(
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

  {usuarioGestion && (

    <div className="user-row">

      <div>

        <strong>
          {
            usuarios.find(
              (u) =>
                u.id ===
                parseInt(
                  usuarioGestion
                )
            )?.nombre
          }
        </strong>

        <p>
          @
          {
            usuarios.find(
              (u) =>
                u.id ===
                parseInt(
                  usuarioGestion
                )
            )?.usuario
          }
        </p>

      </div>

      <button
        className="delete-btn"

        onClick={() =>
          eliminarUsuario(
            parseInt(
              usuarioGestion
            )
          )
        }
      >
        🗑️
      </button>

    </div>
   )}

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
     
   <div className="admin-panel">

   <h2>
    📅 Calendario
   </h2>

   <FullCalendar
    plugins={[
      dayGridPlugin
    ]}
    
eventClick={(info) => {

  setEventoSeleccionado(
    info.event.extendedProps
      .asignacion
  );
   }}


    initialView="dayGridMonth"

    height="auto"

    locale="es"

    events={
      eventosCalendario
    }
   />

   </div>
   
   
 {eventoSeleccionado && (

  <div className="modal-overlay">

    <div className="modal">

      <h2>
        📋 Detalle
      </h2>

      <p>
        <strong>
          Tarea:
        </strong>

        {" "}
        {
          eventoSeleccionado.parte
        }
      </p>

      <p>
        <strong>
          Fecha:
        </strong>

        {" "}
        {
          formatearFecha(
            eventoSeleccionado.fecha
          )
        }
      </p>

      <p>
        <strong>
          Usuarios:
        </strong>

        {" "}

        {
          eventoSeleccionado
            .usuarios_ids

            ? eventoSeleccionado
                .usuarios_ids
                .map((id) => {

                  return usuarios.find(
                    (u) =>
                      u.id === id
                  )?.nombre;
                })

                .join(" + ")

            : usuarios.find(
                (u) =>
                  u.id ===
                  eventoSeleccionado.usuario_id
              )?.nombre
        }

      </p>

      <button
        className="save-btn"

        onClick={() =>
          setEventoSeleccionado(
            null
          )
        }
      >
        Cerrar
      </button>

    </div>

  </div>
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
             
              👥 {

               a.usuarios_ids

                ? a.usuarios_ids
        .map((id) => {

          return usuarios.find(
            (u) =>
              u.id === id
          )?.nombre;
        })

        .join(" + ")

    : usuarios.find(
        (u) =>
          u.id ===
          a.usuario_id
      )?.nombre
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
