const WebSocket = require("ws");
const clients = [];
const messages = [];
var mss = [];
const Mensaje = require("./models/mensajes");
var Joi = require("joi");


const schema2 = Joi.object({
  mensaje: Joi.string().min(5).required(),
  autor: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]+\\s{1}[a-zA-Z0-9]+")),
});

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    Mensaje.findAll().then((result) => {
      mss = result;
      sendMessages();
    });

    ws.on("message", (message) => {
      
      
      let mensaje = message.split(":");
      let texto = mensaje[1].trim();
      let autor = mensaje[0].trim();

      let obj = {
        mensaje: texto,
        autor: autor,
      };
      const { error } = schema2.validate(obj);

      if (!error) {
        Mensaje.create({ mensaje: obj.mensaje, autor: obj.autor }).then(
          (result) => {
            Mensaje.findAll().then((result) => {
              mss = result;
              sendMessages();
            });
          }
        );
      }
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(mss)));
  };

};

exports.wsConnection = wsConnection;
