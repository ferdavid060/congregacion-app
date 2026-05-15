const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// LEER ARCHIVOS
let usuarios = JSON.parse(
  fs.readFileSync("./usuarios.json")
);

let asignaciones = JSON.parse(
  fs.readFileSync("./asignaciones.json")
);

// GUARDAR USUARIOS
const guardarUsuarios = () => {

  fs.writeFileSync(
    "./usuarios.json",

    JSON.stringify(
      usuarios,
      null,
      2
    )
  );
};

// GUARDAR ASIGNACIONES
const guardarAsignaciones =
  () => {

    fs.writeFileSync(
      "./asignaciones.json",

      JSON.stringify(
        asignaciones,
        null,
        2
      )
    );
  };

// LOGIN
app.post("/login", (req, res) => {

  const { usuario, password } =
    req.body;

  const user = usuarios.find(
    (u) =>
      u.usuario === usuario &&
      u.password === password
  );

  if (user) {

    res.json(user);

  } else {

    res.status(401).json({
      mensaje:
        "Credenciales incorrectas"
    });

  }
});

// OBTENER USUARIOS
app.get("/usuarios", (req, res) => {

  res.json(usuarios);
});

// CREAR USUARIO
app.post("/usuarios", (req, res) => {

  const nuevoUsuario =
    req.body;

  // VALIDAR USUARIO REPETIDO
  const existe = usuarios.find(
    (u) =>
      u.usuario ===
      nuevoUsuario.usuario
  );

  if (existe) {

    return res.status(400).json({
      mensaje:
        "El usuario ya existe"
    });
  }

  usuarios.push(nuevoUsuario);

  guardarUsuarios();

  res.json({
    mensaje:
      "Usuario creado"
  });
});

// TODAS LAS ASIGNACIONES
app.get("/asignaciones", (req, res) => {

  res.json(asignaciones);
});

// ASIGNACIONES POR USUARIO
app.get(
  "/asignaciones/:id",
  (req, res) => {

    const id = parseInt(
      req.params.id
    );

    const resultado =
      asignaciones.filter(
        (a) =>
          a.usuario_id === id
      );

    res.json(resultado);
  }
);

// AGREGAR ASIGNACION
app.post(
  "/asignaciones",
  (req, res) => {

    const nuevaAsignacion =
      req.body;

    asignaciones.push(
      nuevaAsignacion
    );

    guardarAsignaciones();

    res.json({
      mensaje:
        "Asignación guardada"
    });
  }
);

// ELIMINAR ASIGNACION
app.delete(
  "/asignaciones/:id",
  (req, res) => {

    const id = parseInt(
      req.params.id
    );

    asignaciones =
      asignaciones.filter(
        (a) => a.id !== id
      );

    guardarAsignaciones();

    res.json({
      mensaje:
        "Asignación eliminada"
    });
  }
);

// EDITAR ASIGNACION
app.put(
  "/asignaciones/:id",
  (req, res) => {

    const id = parseInt(
      req.params.id
    );

    const datosActualizados =
      req.body;

    asignaciones =
      asignaciones.map((a) => {

        if (a.id === id) {

          return datosActualizados;
        }

        return a;
      });

    guardarAsignaciones();

    res.json({
      mensaje:
        "Asignación actualizada"
    });
  }
);

// SERVIDOR
app.listen(3001, () => {

  console.log(
    "Servidor funcionando en puerto 3001"
  );
});

