#!/bin/bash

# 启动后端
echo "Starting backend..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# 启动前端
echo "Starting frontend..."
cd ../frontend
pnpm dev &
FRONTEND_PID=$!

# 捕获 Ctrl+C 信号
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 等待两个进程
wait $BACKEND_PID $FRONTEND_PID