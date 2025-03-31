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
  const start = process.hrtime();
  const result = fib(45);
  const end = process.hrtime(start);
  const executionTime = (end[0] * 1000 + end[1] / 1000000).toFixed(2); // Convert to milliseconds

  res.json({
    fibonacciNumber: result,
    processingTime: `${executionTime}ms`,
    processId: process.pid,
  });
});

// Endpoint to return server info
app.get("/info", (req, res) => {
  res.json({
    name: os.hostname(),
    numberOfCpus: os.cpus().length,
    processId: process.pid,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
