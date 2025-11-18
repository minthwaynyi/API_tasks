// app.js
const express = require("express");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/data");
const loginRoute = require("./routes/login.js");
const { verifyToken } = require("./verifytoken.js");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs')
const {rateLimiter} = require('./middleware/ratelimiter.js')

const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies
app.use(bodyParser.json());

// mount routes for /data
app.use("/data", verifyToken, rateLimiter, dataRoutes);
app.use("/login", loginRoute);

// basic root
app.get("/", (req, res) => {
  res.send("Simple Data API is running. Use /data");
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// const { swaggerUi, swaggerSpec } = require("./swagger");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = app; // for tests
