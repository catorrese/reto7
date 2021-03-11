const { response } = require("express");
var express = require("express");
var router = express.Router();

var Joi = require("joi");
const Mensaje = require("../models/mensajes");

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
  Mensaje.findAll().then((result) => {
    res.send(result);
  });
});

router.get("/:id", (req, res) => {
  Mensaje.findByPk(req.params.id).then((response) => {
    if (response === null)
      return res.status(404).send("El mensaje con el id dado no se encuentra.");
    res.send(response);
  });
});

router.post("/", function (req, res, next) {
  const { error } = schema2.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Mensaje.create({ mensaje: req.body.mensaje, autor: req.body.autor }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.post("/", (req, res) => {
  const { error } = schema2.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Mensaje.create({ mensaje: req.body.mensaje, autor: req.body.autor }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.put("/:id", (req, res) => {
  const { error } = schema2.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Mensaje.update(req.body, { where: { id: req.params.id } }).then((response) => {
    if (response[0] !== 0) res.send({ message: "Mensaje actualizado" });
    else res.status(404).send({ message: "El mensaje no fue encontrado" });
  });
});

router.delete("/:id", (req, res) => {
  Mensaje.destroy({
    where: {
      id: req.params.id,
    },
  }).then((response) => {
    if (response === 1) res.status(204).send();
    else res.status(404).send({ message: "El mensaje no fue encontrado" });
  });
});

module.exports = router;
