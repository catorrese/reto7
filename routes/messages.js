var express = require("express");
var router = express.Router();
var fs = require("fs");
var Joi = require("joi");

const schema = Joi.object({
  mensaje: Joi.string().min(5).required(),
  autor: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]+\\s{1}[a-zA-Z0-9]+")),
  ts: Joi.number(),
});

const schema2 = Joi.object({
  mensaje: Joi.string().min(5).required(),
  autor: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]+\\s{1}[a-zA-Z0-9]+")),
});

/* GET messages listing. */
router.get("/", function (req, res, next) {
  data = fs.readFileSync("./mensajes.json");
  datos = Array.from(JSON.parse(data));
  const mensajes = datos
    .map(
      (item) =>
        `<p>${item.autor + ": " + item.mensaje + " --- ts: " + item.ts}</p>`
    )
    .join(" ");
  res.send(mensajes);
});

router.get("/:ts", function (req, res, next) {
  data = fs.readFileSync("./mensajes.json");
  datos = Array.from(JSON.parse(data));
  let ans = "No se encuentra dicho ts.";
  let seEncuentra = false;
  datos.forEach((element) => {
    if (element.ts == req.params.ts) {
      ans = element.autor + ": " + element.mensaje + " --- ts: " + element.ts;
      seEncuentra = true;
    }
  });
  if (!seEncuentra) {
    res.status(404);
  }
  res.send(ans);
});

router.post("/", function (req, res) {
  data = fs.readFileSync("./mensajes.json");
  datos = Array.from(JSON.parse(data));
  obj = req.body;
  let ans = "Post enviado: " + JSON.stringify(obj);
  if (schema.validate(obj).error) {
    ans = "Error en uno de los campos enviados. Joi";
    res.status(404);
  } else {
    let seEncuentra = false;
    datos.forEach((element) => {
      if (element.ts == obj.ts) {
        ans = "El ts ya existe.";
        seEncuentra = true;
        res.status(404);
      }
    });
    if (!seEncuentra) {
      datos.push(obj);
      fs.writeFile(
        "./mensajes.json",
        JSON.stringify(datos),
        { flag: "w" },
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  }

  res.send(ans);
});

router.put("/:ts", function (req, res) {
  data = fs.readFileSync("./mensajes.json");
  datos = Array.from(JSON.parse(data));
  obj = req.body;
  let ans = "No se encuentra dicho ts.";
  if (schema2.validate(obj).error) {
    ans = "Error en uno de los campos enviados. Joi";
    res.status(404);
  } else {
    let seEncuentra = false;
    datos.forEach((element) => {
      if (element.ts == req.params.ts) {
        element.mensaje = obj.mensaje;
        element.autor = obj.autor;
        ans =
          "Put enviado: " +
          element.autor +
          ": " +
          element.mensaje +
          " --- ts: " +
          element.ts;
        seEncuentra = true;
      }
    });
    fs.writeFile(
      "./mensajes.json",
      JSON.stringify(datos),
      { flag: "w" },
      function (err) {
        if (err) return console.log(err);
      }
    );
    if (!seEncuentra) {
      res.status(404);
    }
  }

  res.send(ans);
});

router.delete("/:ts", function (req, res) {
  data = fs.readFileSync("./mensajes.json");
  datos = Array.from(JSON.parse(data));
  let ans = "No se encuentra dicho ts.";
  let eliminado = null;
  let seEncuentra = false;
  datos.forEach((element) => {
    if (element.ts == req.params.ts) {
      ans =
        "Delete enviado: " +
        element.autor +
        ": " +
        element.mensaje +
        " --- ts: " +
        element.ts;
      seEncuentra = true;
      eliminado = element;
    }
  });
  if (!seEncuentra) {
    res.status(404);
  } else {
    datos.splice(datos.indexOf(eliminado), 1);
  }

  fs.writeFile(
    "./mensajes.json",
    JSON.stringify(datos),
    { flag: "w" },
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.send(ans);
});

module.exports = router;
