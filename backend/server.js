const http = require("http"); // default nodejs package
const app = require("./app");

const port = process.env.PORT || 3000;

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
