const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
require("dotenv").config();
const { Pool } =
  require("pg");

const pool = new Pool({

  connectionString:
    process.env
      .DATABASE_URL,

  ssl: {
    rejectUnauthorized:
      false
  }
});
pool.connect()

  .then(() => {

    console.log(
      "🔥 PostgreSQL conectado"
    );
  })

  .catch((err) => {

    console.log(
      "❌ Error PostgreSQL",
      err
    );
  }); 

  
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
app.post(
  "/login",

  async (
    req,
    res
  ) => {

    try {

      const {
        usuario,
        password
      } = req.body;

      const result =
        await pool.query(

`SELECT * FROM usuarios
 WHERE usuario = $1
 AND password = $2`,

          [
            usuario,
            password
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res
          .status(401)
          .json({
            error:
              "Usuario o contraseña incorrectos"
          });
      }

      res.json(
        result.rows[0]
      );

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error login"
      });
    }
  }
);

// OBTENER USUARIOS
app.get(
  "/usuarios",

  async (
    req,
    res
  ) => {

    try {

      const result =
        await pool.query(
          "SELECT * FROM usuarios"
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error al obtener usuarios"
      });
    }
  }
);

// CREAR USUARIO
app.post(
  "/usuarios",

  async (
    req,
    res
  ) => {

    try {

      const {
        id,
        nombre,
        usuario,
        password,
        rol
      } = req.body;

      const existe =
        await pool.query(

`SELECT * FROM usuarios
 WHERE usuario = $1`,

          [usuario]
        );

      if (
        existe.rows.length > 0
      ) {

        return res
          .status(400)
          .json({
            mensaje:
              "El usuario ya existe"
          });
      }

      await pool.query(

`INSERT INTO usuarios
(
  id,
  nombre,
  usuario,
  password,
  rol
)

VALUES
(
  $1,
  $2,
  $3,
  $4,
  $5
)`,

        [
          id,
          nombre,
          usuario,
          password,
          rol
        ]
      );

      res.json({
        mensaje:
          "Usuario creado"
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error creando usuario"
      });
    }
  }
);

// TODAS LAS ASIGNACIONES
app.get(
  "/asignaciones",

  async (
    req,
    res
  ) => {

    try {

      const result =
        await pool.query(

`SELECT * FROM asignaciones
 ORDER BY fecha ASC`

        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error obteniendo asignaciones"
      });
    }
  }
);

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

  async (
    req,
    res
  ) => {

    try {

      const {

        id,
        parte,
        fecha,
        categoria,
        nota,
        importante,
        usuarios_ids

      } = req.body;

      await pool.query(

`INSERT INTO asignaciones
(
  id,
  parte,
  fecha,
  categoria,
  nota,
  importante,
  usuarios_ids
)

VALUES
(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7
)`,

        [
          id,
          parte,
          fecha,
          categoria,
          nota,
          importante,
          usuarios_ids
        ]
      );

      res.json({
        mensaje:
          "Asignación guardada"
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error creando asignación"
      });
    }
  }
);

// ELIMINAR USUARIO
app.delete(
  "/usuarios/:id",
  (req, res) => {

    const id = parseInt(
      req.params.id
    );

    usuarios = usuarios.filter(
      (u) => u.id !== id
    );

    // ELIMINAR ASIGNACIONES
    asignaciones =
      asignaciones.filter(
        (a) =>
          a.usuario_id !== id
      );

    guardarUsuarios();

    guardarAsignaciones();

    res.json({
      mensaje:
        "Usuario eliminado"
    });
  }
);


// ELIMINAR ASIGNACION
app.delete(
  "/asignaciones/:id",

  async (
    req,
    res
  ) => {

    try {

      const id =
        parseInt(
          req.params.id
        );

      await pool.query(

`DELETE FROM asignaciones
 WHERE id = $1`,

        [id]
      );

      res.json({
        mensaje:
          "Asignación eliminada"
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error eliminando asignación"
      });
    }
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
app.get(
  "/informes",

  async (
    req,
    res
  ) => {

    try {

      const result =
        await pool.query(

`SELECT * FROM informes
 ORDER BY id DESC`

        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error obteniendo informes"
      });
    }
  }
);
app.post(
  "/informes",

  async (
    req,
    res
  ) => {

    try {

      const {

        id,
        usuario,
        usuario_id,
        horas,
        cursos,
        participa,
        comentario

      } = req.body;

      await pool.query(

`INSERT INTO informes
(
  id,
  usuario,
  usuario_id,
  horas,
  cursos,
  participa,
  comentario
)

VALUES
(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7
)`,

        [
          id,
          usuario,
          usuario_id,
          horas,
          cursos,
          participa,
          comentario
        ]
      );

      res.json({
        mensaje:
          "Informe guardado"
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        error:
          "Error guardando informe"
      });
    }
  }
);
// SERVIDOR
app.listen(3001, () => {

  console.log(
    "Servidor funcionando en puerto 3001"
  );
});

