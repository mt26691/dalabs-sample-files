const express = require("express");
const os = require("os");
const cluster = require("cluster");

// Check if current process is primary
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log("=".repeat(60));
  console.log(`[${new Date().toISOString()}] SERVER STARTED (Cluster Mode)`);
  console.log(`[${new Date().toISOString()}] Primary Process ID: ${process.pid}`);
  console.log(`[${new Date().toISOString()}] Available CPUs: ${numCPUs}`);
  console.log(`[${new Date().toISOString()}] Forking ${numCPUs} worker processes...`);
  console.log("=".repeat(60));

  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log(`[${new Date().toISOString()}] [Primary] Forked worker ${i + 1}/${numCPUs} with PID: ${worker.process.pid}`);
  }

  // Log when a worker comes online
  cluster.on("online", (worker) => {
    console.log(`[${new Date().toISOString()}] [Primary] Worker ${worker.process.pid} is now online and ready`);
  });

  // Log when a worker dies and fork a new one
  cluster.on("exit", (worker, code, signal) => {
    console.log(`[${new Date().toISOString()}] [Primary] Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
    console.log(`[${new Date().toISOString()}] [Primary] Forking a new worker to replace...`);
    const newWorker = cluster.fork();
    console.log(`[${new Date().toISOString()}] [Primary] New worker forked with PID: ${newWorker.process.pid}`);
  });

} else {
  // Worker processes will run the Express server
  const app = express();
  const PORT = 3000;

  // Simple recursive Fibonacci (not optimized for large numbers)
  function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }

  // Endpoint to return the 50th Fibonacci number
  app.get("/fib", (req, res) => {
    console.log(`[${new Date().toISOString()}] [Worker ${process.pid}] --> Incoming request: GET /fib`);

    const start = process.hrtime();
    const result = fib(50);
    const end = process.hrtime(start);
    const executionTime = (end[0] * 1000 + end[1] / 1000000).toFixed(2);

    console.log(`[${new Date().toISOString()}] [Worker ${process.pid}] <-- Response: GET /fib - Fibonacci(50) = ${result}, computed in ${executionTime}ms`);

    res.json({
      fibonacciNumber: result,
      processingTime: `${executionTime}ms`,
      processId: process.pid,
    });
  });

  // Endpoint to return server info
  app.get("/info", (req, res) => {
    console.log(`[${new Date().toISOString()}] [Worker ${process.pid}] --> Incoming request: GET /info`);

    const info = {
      name: os.hostname(),
      numberOfCpus: os.cpus().length,
      processId: process.pid,
    };

    console.log(`[${new Date().toISOString()}] [Worker ${process.pid}] <-- Response: GET /info - hostname: ${info.name}, CPUs: ${info.numberOfCpus}`);

    res.json(info);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] [Worker ${process.pid}] Server listening on http://localhost:${PORT}`);
  });
}
