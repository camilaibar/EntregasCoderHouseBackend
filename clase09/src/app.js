const express = require("express");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");

const { mongoDBConnection } = require("./config/mongoDBConfig");
const ViewsRouter = require("./routes/handlebarsViewsRouter");

const API_VERSION = "v1";

class App {
  app;
  env;
  port;
  server;
  views;

  constructor(routes) {
    this.app = express();
    this.env = "DEV";
    this.port = 8080;
    this.views = new ViewsRouter();

    this.connectToDataBase();
    this.initializeMiddlewares();
    this.initilizeRoutes(routes);
    this.initializeHandlebars();
  }

  // Server
  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`ENV: ${this.env}`);
      console.log(`PORT: ${this.port}`);
      displayRoutes(this.app);
    });
  };

  getServer = () => this.app;

  closeServer = () =>
    (this.server = this.app.listen(this.port, () => {
      done();
    }));

  // DB
  connectToDataBase = async () => {
    await mongoDBConnection();
  };

  // Middlewares
  initializeMiddlewares = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(__dirname + "/public"));
  };

  // Socket
  initializeSocket = () => {};

  // Handlebars
  initializeHandlebars = () => {
    this.app.engine(
      "hbs",
      handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
    );
    this.app.set("views", __dirname + "/views/");
    this.app.set("view engine", "hbs");

    this.app.use("/hbs", this.views.router);
  };

  // Endpoints
  initilizeRoutes = (routes) => {
    routes.forEach((route) => {
      this.app.use(`/api/${API_VERSION}`, route.router);
    });
  };
}

module.exports = App;

//Socket events
