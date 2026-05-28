import { useState, useEffect } from "react";
import "./App.css";
import FullCalendar from
"@fullcalendar/react";
import dayGridPlugin from
"@fullcalendar/daygrid";
import timeGridPlugin
from "@fullcalendar/timegrid";
import jsPDF from "jspdf";


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
  
 const [nota,
   setNota] =
   useState("");

const [informes,
setInformes] =
useState([]);

 const [importante,
  setImportante] =
  useState(false);


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
  const [
  filtroUsuario,
  setFiltroUsuario
] = useState("");

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
 
 const [pantallaActiva,
  setPantallaActiva] =
  useState("inicio");
 

 const [horas,
  setHoras] =
  useState("");

 const [cursos,
  setCursos] =
  useState("");

 const [participa,
  setParticipa] =
  useState(true);

 const [comentarioInforme,
  setComentarioInforme] =
  useState("");

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
const obtenerInformes =
async () => {

  const res =
    await fetch(
      "https://congregacion-app.onrender.com/informes"
    );

  const data =
    await res.json();

  setInformes(data);
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

  obtenerInformes();

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

     
   categoria:
   categoriaSeleccionada,

    nota,
    importante,

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
      setNota("");
      setImportante(false);
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

  let asignacionesFiltradas = [];

if (
  user &&
  user.rol !== "admin"
) {

  asignacionesFiltradas =
    asignaciones.filter(
      (a) => {

        if (
          a.usuarios_ids
        ) {

          return a.usuarios_ids.includes(
            user.id
          );
        }

        return (
          a.usuario_id ===
          user.id
        );
      }
    );

} else {

  if (
    filtroUsuario ===
    "todos"
  ) {

    asignacionesFiltradas =
      asignaciones;

  } else if (
    filtroUsuario !== ""
  ) {

    asignacionesFiltradas =
      asignaciones.filter(
        (a) => {

          if (
            a.usuarios_ids
          ) {

            return a.usuarios_ids.includes(
              parseInt(
                filtroUsuario
              )
            );
          }

          return (
            a.usuario_id ===
            parseInt(
              filtroUsuario
            )
          );
        }
      );
  }
}
  
 
const coloresCategorias = {

  "Entre semana":
    "#2563eb",

  "Fin de semana":
    "#16a34a",

  "Audio y video":
    "#9333ea",

  "Acomodadores":
    "#ea580c"
};


 const emojisCategorias = {

  "Entre semana":
    "📖",

  "Fin de semana":
    "📅",

  "Audio y video":
    "🎧",

  "Acomodadores":
    "🚪"
};

const generarMensajeWhatsApp =
  (evento) => {

    const nombres =

      evento.usuarios_ids

        ? evento.usuarios_ids
            .map((id) => {

             return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre;
            })

            .join(" + ")

        : usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(evento.usuario_id)

)?.nombre;

    return encodeURIComponent(

`Hola 🙂 

Te toca:

${evento.parte}

📅 ${formatearFecha(
  evento.fecha
)}

👥 ${nombres}

${
  evento.nota
    ? `📝 ${evento.nota}`
    : ""
}`
    );
  };

 const exportarPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(22);

  doc.text(
    "Programa mensual",
    20,
    20
  );

  let y = 40;

  asignacionesFiltradas.forEach(
    (a) => {

      const nombres =

        a.usuarios_ids

          ? a.usuarios_ids
              .map((id) => {

                return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre;
              })

              .join(" + ")

          : usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(a.usuario_id)

)?.nombre;

      // CUADRO

      doc.roundedRect(
        15,
        y - 8,
        180,
        35,
        3,
        3
      );

      // TITULO

      doc.setFontSize(14);

      doc.text(

`${a.importante ? "⭐ " : ""}
${a.categoria || "General"}`,

        20,
        y
      );

      // FECHA

      doc.setFontSize(11);

      doc.text(
        `📅 ${formatearFecha(
          a.fecha
        )}`,
        20,
        y + 8
      );

      // PARTE

      doc.text(
        `📌 ${a.parte}`,
        20,
        y + 16
      );

      // USUARIOS

      doc.text(
        `👥 ${nombres}`,
        20,
        y + 24
      );

      // NOTA

      if (a.nota) {

        doc.setFontSize(10);

        doc.text(
          `📝 ${a.nota}`,
          20,
          y + 32
        );

        y += 12;
      }

      y += 45;

      // NUEVA PAGINA

      if (y > 250) {

        doc.addPage();

        y = 20;
      }
    }
  );

  doc.save(
    "programa-mensual.pdf"
  );
};

  
 const eventosCalendario =

  asignacionesFiltradas.map(
    (a) => ({

      title:

        
      

`${a.importante ? "⭐ " : ""}
${emojisCategorias[
  a.categoria
] || "📌"} ${a.parte} - ` +






        (

          a.usuarios_ids

            ? a.usuarios_ids
                .map((id) => {

                  return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre
                })

                .join(" + ")

            : usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(a.usuario_id)

)?.nombre
        ),

      date: a.fecha,
      
    backgroundColor:
  coloresCategorias[
    a.categoria
  ] || "#2563eb",

    borderColor:
  coloresCategorias[
    a.categoria
  ] || "#2563eb",
 
    borderWidth:
   a.importante
    ? 4
    : 1,



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
  
<div className="menu-mobile">

  <button
    className={
      pantallaActiva === "inicio"
        ? "menu-btn active"
        : "menu-btn"
    }

    onClick={() =>
      setPantallaActiva(
        "inicio"
      )
    }
  >
    <span>🏠</span>
    <p>Inicio</p>
  </button>

  <button
    className={
      pantallaActiva ===
      "calendario"

        ? "menu-btn active"

        : "menu-btn"
    }

    onClick={() =>
      setPantallaActiva(
        "calendario"
      )
    }
  >
    <span>📅</span>
    <p>Calendario</p>
  </button>

  {user.rol ===
  "admin" && (

<button
  className={
    pantallaActiva ===
    "nueva"

      ? "menu-btn active"

      : "menu-btn"
  }

  onClick={() =>
    setPantallaActiva(
      "nueva"
    )
  }
>
  <span>➕</span>
  <p>Nueva</p>
</button>
)}

  {user.rol ===
  "admin" && (

<button
  className={
    pantallaActiva ===
    "usuarios"

      ? "menu-btn active"

      : "menu-btn"
  }

  onClick={() =>
    setPantallaActiva(
      "usuarios"
    )
  }
>
  <span>👥</span>

  <p>Usuarios</p>

</button>
)}
<button
  className={
    pantallaActiva ===
    "informes"

      ? "menu-btn active"

      : "menu-btn"
  }

  onClick={() =>
    setPantallaActiva(
      "informes"
    )
  }
>
  <span>📝</span>
  <p>Informes</p>
</button>

</div>
 


{pantallaActiva ===
  "inicio" && (

      <div className="header">

        <div>

          <h1 className="welcome-title">
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
     )}
     {pantallaActiva ===
  "inicio" && (

<>
<div className="dashboard-grid">

  <div className="dashboard-card">

    <h3>
      📅 Asignaciones
    </h3>

    <h1>
      {
        asignaciones.length
      }
    </h1>

  </div>

  <div className="dashboard-card">

    <h3>
      👥 Usuarios
    </h3>

    <h1>
      {
        usuarios.length
      }
    </h1>

  </div>

  <div className="dashboard-card">

    <h3>
      📝 Informes
    </h3>

    <h1>
      {
        informes.length
      }
    </h1>

  </div>

</div>

<div className="dashboard-next">

  <h2>
    ⭐ Próxima asignación
  </h2>

  {

    asignaciones[0] && (

      <div className="next-card">

        <h3>
          {
            asignaciones[0]
              .parte
          }
        </h3>

        <p>
          📅 {
            formatearFecha(
              asignaciones[0]
                .fecha
            )
          }
        </p>

        <p>
          👥 {

            asignaciones[0]
              .usuarios_ids

              ? asignaciones[0]
                  .usuarios_ids
                  .map((id) => {

                    return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre;
                  })

                  .join(" + ")

              : usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(asignaciones[0].usuario_id)

)?.nombre
          }
        </p>

      </div>
    )
  }

</div>
</>
)}
      {user.rol ===
     "admin" &&

      pantallaActiva ===
  "nueva" && (
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
          
      <input
      type="text"

      placeholder="Notas"

     value={nota}

     onChange={(e) =>
       setNota(
      e.target.value
      )
      }
      />
      
    <label>

    <input
    type="checkbox"

    checked={importante}

    onChange={(e) =>
      setImportante(
        e.target.checked
      )
    }
   />

    {" "}
   ⭐ Evento importante

   </label>



            <button
              className="add-btn"
              onClick={
                agregarAsignacion
              }
            >
              ➕ Agregar
            </button>

          </div>
          


</>
)}
{user.rol ===
  "admin" &&

pantallaActiva ===
  "usuarios" && (
<>

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
        </>
      )}
      
{pantallaActiva ===
  "informes" && (

<div className="admin-panel">

  <h2>
    📝 Informe mensual
  </h2>

  <label>
    Participó en predicación
  </label>

  <select
    value={participa}

    onChange={(e) =>
      setParticipa(
        e.target.value
      )
    }
  >

    <option value={true}>
      Sí
    </option>

    <option value={false}>
      No
    </option>

  </select>

  <input
    type="number"

    placeholder="Horas"

    value={horas}

    onChange={(e) =>
      setHoras(
        e.target.value
      )
    }
  />

  <input
    type="number"

    placeholder="Cursos"

    value={cursos}

    onChange={(e) =>
      setCursos(
        e.target.value
      )
    }
  />

  <textarea
    placeholder="Comentarios"

    value={comentarioInforme}

    onChange={(e) =>
      setComentarioInforme(
        e.target.value
      )
    }
  />

  <button
    className="add-btn"

    onClick={async () => {

  const nuevoInforme = {

    id: Date.now(),

    usuario:
      user.nombre,

    usuario_id:
      user.id,

    horas,

    cursos,

    participa,

    comentario:
      comentarioInforme
  };

  await fetch(
    "https://congregacion-app.onrender.com/informes",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        nuevoInforme
      )
    }
  );

  obtenerInformes();

  setHoras("");

  setCursos("");

  setComentarioInforme("");

  alert(
    "Informe enviado"
  );
}}
  >
    📝 Enviar informe
  </button>
  {user?.rol ===
  "admin" && (
<div className="cards-grid">

  {informes.map((i) => (

    <div
      key={i.id}
      className="card"
    >

      <h3>
        👤 {i.usuario}
      </h3>

      <p>
        ⏱️ Horas:
        {" "}
        {i.horas}
      </p>

      <p>
        📚 Cursos:
        {" "}
        {i.cursos}
      </p>

      <p>
        📣 Participó:
        {" "}
        {
          i.participa ===
          true ||

          i.participa ===
          "true"

            ? "Sí"

            : "No"
        }
      </p>

      {i.comentario && (

        <p>
          📝 {
            i.comentario
          }
        </p>
      )}

    </div>
  ))}

</div>

)}
</div>
)}

     {pantallaActiva === "calendario" && (
   <div className="admin-panel">

   <h2>
    📅 Calendario
   </h2>
    
    {user?.rol ===
  "admin" && (

<div className="admin-panel filtro-panel">

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

    <option value="">
      Seleccionar
    </option>

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
)}
    
  
<button
 className="add-btn export-btn"

  onClick={exportarPDF}
>
  📄 Exportar PDF
</button>

{asignacionesFiltradas
  .length > 0 && (

<>
  <h2 className="section-title">
    📋 Asignaciones
  </h2>
<div className="cards-grid">
  {asignacionesFiltradas.map(
    (a) => (

    <div
      key={a.id}
      className="card"
    >

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

      

<p className="usuarios-card">

👥 {

a.usuarios_ids

? a.usuarios_ids
.map((id) => {

return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre;
})

.join(" + ")

: usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(a.usuario_id)

)?.nombre
}
</p>

{user?.rol ===
  "admin" && (

<button
  className="
    delete-btn
    delete-card-btn
  "

  onClick={() =>
    eliminarAsignacion(
      a.id
    )
  }
>
  🗑️ Eliminar
</button>
)}

    </div>
  ))}

  </div>
</>
)}
   <FullCalendar
  firstDay={1}

  plugins={[
    dayGridPlugin,
    timeGridPlugin
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
   )}
   
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
        
      {eventoSeleccionado.nota && (

  <p>

    <strong>
      Nota:
    </strong>

    {" "}

    {
      eventoSeleccionado.nota
    }

    </p>
    )}


        {" "}

        {
          eventoSeleccionado
            .usuarios_ids

            ? eventoSeleccionado
                .usuarios_ids
                .map((id) => {

                  return usuarios.find(
  (u) =>

    parseInt(u.id) ===
    parseInt(id)

)?.nombre;
                })

                .join(" + ")

            : usuarios.find(
(u) =>

parseInt(u.id) ===
parseInt(eventoSeleccionado.usuario_id)

)?.nombre
        }

      </p>
{user?.rol ===
  "admin" && (

<button
  className="
    delete-btn
    delete-card-btn
  "

  onClick={() =>
    eliminarAsignacion(
  eventoSeleccionado.id
)
  }
>
  🗑️ Eliminar
</button>
)}
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
      
<button
  className="add-btn"

  onClick={() => {

    const mensaje =

      generarMensajeWhatsApp(
        eventoSeleccionado
      );

    window.open(
      `https://wa.me/?text=${mensaje}`,
      "_blank"
    );
  }}
>
  📲 WhatsApp
</button>


    </div>

  </div>
)}

      </div>
    
  );
  
}


export default App;
