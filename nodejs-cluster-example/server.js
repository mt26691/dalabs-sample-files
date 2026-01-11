const express = require("express");
const os = require("os");

const app = express();
const PORT = 3000;

// Simple recursive Fibonacci (not optimized for large numbers)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Endpoint to return the 50th Fibonacci number
app.get("/fib", (req, res) => {
  console.log(`[${new Date().toISOString()}] [PID: ${process.pid}] --> Incoming request: GET /fib`);

  const start = process.hrtime();
  const result = fib(50);
  const end = process.hrtime(start);
  const executionTime = (end[0] * 1000 + end[1] / 1000000).toFixed(2);

  console.log(`[${new Date().toISOString()}] [PID: ${process.pid}] <-- Response: GET /fib - Fibonacci(50) = ${result}, computed in ${executionTime}ms`);

  res.json({
    fibonacciNumber: result,
    processingTime: `${executionTime}ms`,
    processId: process.pid,
  });
});

// Endpoint to return server info
app.get("/info", (req, res) => {
  console.log(`[${new Date().toISOString()}] [PID: ${process.pid}] --> Incoming request: GET /info`);

  const info = {
    name: os.hostname(),
    numberOfCpus: os.cpus().length,
    processId: process.pid,
  };

  console.log(`[${new Date().toISOString()}] [PID: ${process.pid}] <-- Response: GET /info - hostname: ${info.name}, CPUs: ${info.numberOfCpus}`);

  res.json(info);
});

// Start the server (non-cluster mode)
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log(`[${new Date().toISOString()}] SERVER STARTED (Non-Cluster Mode)`);
  console.log(`[${new Date().toISOString()}] Process ID: ${process.pid}`);
  console.log(`[${new Date().toISOString()}] Available CPUs: ${os.cpus().length}`);
  console.log(`[${new Date().toISOString()}] Listening on: http://localhost:${PORT}`);
  console.log(`[${new Date().toISOString()}] Note: Running single process - no cluster module`);
  console.log("=".repeat(60));
});
