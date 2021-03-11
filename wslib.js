const WebSocket = require("ws");
const clients = [];
const messages = [];
var mss = [];
var fs = require("fs");
var Joi = require("joi");

const schema = Joi.object({
  mensaje: Joi.string().min(5).required(),
  autor: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]+\\s{1}[a-zA-Z0-9]+")),
    ts: Joi.number()
});

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    savedMessages();
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      postMessage(message);
      sendMessages();
    });

    ws.on("upgrade", () => {
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(mss)));
  };

  const savedMessages = () => {
    data = fs.readFileSync("./mensajes.json");
    datos = Array.from(JSON.parse(data));
    mss = Array.from(datos);
  };

  const postMessage = (message) => {
    let mensaje = message.split(":");
    let texto = mensaje[1].trim();
    let autor = mensaje[0].trim();
    let ts = parseInt(fs.readFileSync("./ts.txt"));
    let obj = {
      mensaje: texto,
      autor: autor,
      ts: ts,
    };
    if (schema.validate(obj).error) {
      console.log(schema.validate(obj));
    }
    else {
      data = fs.readFileSync("./mensajes.json");
      datos = Array.from(JSON.parse(data));
      let seEncuentra = true;
      while(seEncuentra){
        seEncuentra = false;
        datos.forEach((element) => {
          if (element.ts == ts) {
            seEncuentra = true;
          }
        });
        ts++;
        obj.ts = ts-1;
      }
      fs.writeFile(
        "./ts.txt",
        ""+ts,
        { flag: "w" },
        function (err) {
          if (err) return console.log(err);
        }
      );

      mss.push(obj);
      fs.writeFile(
        "./mensajes.json",
        JSON.stringify(mss),
        { flag: "w" },
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  };
};

exports.wsConnection = wsConnection;
