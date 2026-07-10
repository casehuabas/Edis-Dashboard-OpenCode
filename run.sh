#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Building backend ==="
cd "$ROOT/backend"
npm run build

echo "=== Starting backend on port 3000 ==="
node dist/app.js &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

echo "=== Starting frontend on port 3001 ==="
cd "$ROOT/frontend"
PORT=3001 npx react-scripts start &
FRONTEND_PID=$!

echo "=== App running ==="
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
