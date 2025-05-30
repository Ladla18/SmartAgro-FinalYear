const serverlessExpress = require("@vendia/serverless-express");
const app = require("./server"); // Assuming your Express app is exported from server.js

exports.handler = serverlessExpress({ app });
