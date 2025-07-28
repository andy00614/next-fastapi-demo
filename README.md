# FastAPI + Next.js AI 全栈应用脚手架

基于 FastAPI 和 Next.js 的 AI 全栈应用脚手架，集成了用户认证、数据库操作和 AI 功能。

## 快速命令

```bash
# 一键启动开发环境
make dev

# 查看所有可用命令
make help
```

## 技术栈

- **后端**: FastAPI + PostgreSQL (Neon) + SQLAlchemy + Alembic
- **前端**: Next.js + better-saas 脚手架
- **AI**: OpenAI API
- **包管理**: pnpm workspace (monorepo)

## 项目结构

```
fast-api-next/
├── backend/          # FastAPI 后端
│   ├── app/         # 应用代码
│   │   ├── api/     # API 路由
│   │   ├── core/    # 核心配置
│   │   ├── db/      # 数据库连接
│   │   ├── models/  # 数据模型
│   │   ├── schemas/ # Pydantic schemas
│   │   └── services/# 业务逻辑
│   ├── alembic/     # 数据库迁移
│   └── tests/       # 测试代码
├── frontend/        # Next.js 前端（基于 better-saas）
└── pnpm-workspace.yaml

## 快速开始

### 1. 安装依赖

```bash
# 安装 pnpm (如果还没有安装)
npm install -g pnpm

# 设置 Python 环境（使用 mise）
mise use python@3.11

# 一键安装所有依赖
make install
# 或者使用 pnpm (需要先更新 pnpm 版本)
pnpm install:all
```

### 2. 配置环境变量

后端环境变量已配置在 `backend/.env`：
- `DATABASE_URL`: PostgreSQL 连接字符串
- `OPENAI_API_KEY`: OpenAI API 密钥
- `SECRET_KEY`: JWT 密钥（需要修改）

前端环境变量在 `frontend/.env.local`：
- `NEXT_PUBLIC_API_URL`: 后端 API 地址

### 3. 数据库迁移

```bash
# 运行数据库迁移
make db-migrate

# 创建新的迁移文件
make db-makemigrations msg="Initial migration"
```

### 4. 启动服务

**一键启动前后端（推荐）**：
```bash
# 使用 Make
make dev

# 或使用脚本
./dev.sh

# 或使用 pnpm (需要更新 pnpm 版本并安装 concurrently)
pnpm dev
```

**分别启动**：
```bash
# 后端
cd backend
./run.sh

# 前端（新终端）
cd frontend
pnpm dev
```

### 5. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 功能示例

### Task Manager 示例

访问 http://localhost:3000/tasks 查看任务管理示例，包含：

- ✅ 任务 CRUD 操作
- ✅ AI 摘要生成
- ✅ 实时状态更新

### API 端点

- `GET /api/v1/tasks` - 获取所有任务
- `POST /api/v1/tasks` - 创建任务
- `PUT /api/v1/tasks/{id}` - 更新任务
- `DELETE /api/v1/tasks/{id}` - 删除任务
- `POST /api/v1/tasks/{id}/ai-summary` - 生成 AI 摘要

## 开发指南

### 添加新的 API 端点

1. 在 `backend/app/models/` 创建模型
2. 在 `backend/app/schemas/` 创建 schema
3. 在 `backend/app/api/v1/` 创建路由
4. 运行数据库迁移

### 添加前端页面

1. 在 `frontend/src/app/` 创建页面
2. 在 `frontend/src/components/` 创建组件
3. 在 `frontend/src/lib/api.ts` 添加 API 调用

## 注意事项

- 数据库迁移必须从 Python 后端执行
- 前端认证使用 better-saas 的实现
- 所有 AI 操作通过后端 API 调用