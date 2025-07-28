.PHONY: dev install build start clean

# 开发模式 - 同时启动前后端
dev:
	@echo "Starting development servers..."
	@./dev.sh

# 安装所有依赖
install:
	@echo "Installing dependencies..."
	@cd frontend && pnpm install
	@cd backend && python3.11 -m venv venv && ./venv/bin/pip install -r requirements.txt

# 构建前端
build:
	@echo "Building frontend..."
	@cd frontend && pnpm build

# 生产模式启动
start:
	@echo "Starting production servers..."
	@cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 &
	@cd frontend && pnpm start &

# 数据库迁移
db-migrate:
	@echo "Running database migrations..."
	@cd backend && source venv/bin/activate && alembic upgrade head

# 创建新的数据库迁移
db-makemigrations:
	@echo "Creating new migration..."
	@cd backend && source venv/bin/activate && alembic revision --autogenerate -m "$(msg)"

# 清理
clean:
	@echo "Cleaning up..."
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@find . -type f -name "*.pyc" -delete
	@rm -rf backend/venv
	@rm -rf frontend/node_modules
	@rm -rf frontend/.next

# 帮助
help:
	@echo "Available commands:"
	@echo "  make dev              - Start development servers (frontend + backend)"
	@echo "  make install          - Install all dependencies"
	@echo "  make build            - Build frontend for production"
	@echo "  make start            - Start production servers"
	@echo "  make db-migrate       - Run database migrations"
	@echo "  make db-makemigrations msg='your message' - Create new migration"
	@echo "  make clean            - Clean up generated files"
	@echo "  make help             - Show this help message"