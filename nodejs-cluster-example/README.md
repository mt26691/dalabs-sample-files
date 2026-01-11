# Node.js Cluster Example

A demonstration of Node.js clustering to utilize multiple CPU cores for improved performance.

## Installation

```bash
npm install
```

## Usage

### Run without clustering (single process)

```bash
npm run start
```

This starts the server in **non-cluster mode** using a single process.

### Run with clustering (multiple processes)

```bash
npm run start:cluster
```

This starts the server in **cluster mode**, forking a worker process for each available CPU core.

## API Endpoints

| Endpoint    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `GET /fib`  | Computes and returns the 50th Fibonacci number (CPU-intensive) |
| `GET /info` | Returns server information (hostname, CPU count, process ID)   |

## Testing

```bash
# Test the /info endpoint
curl http://localhost:3000/info

# Test the /fib endpoint (CPU-intensive, may take time)
curl http://localhost:3000/fib
```

## Cluster vs Non-Cluster Mode

- **Non-Cluster Mode**: Single process handles all requests sequentially. Good for simple applications or development.
- **Cluster Mode**: Multiple worker processes share the load. Each CPU core runs a worker, allowing parallel request handling for better performance under load.
