# 从零开始构建 FastAPI 后端 - JavaScript 开发者的 Python 之旅

## 目录
1. [环境准备](#1-环境准备)
2. [Python 基础概念](#2-python-基础概念)
3. [项目初始化](#3-项目初始化)
4. [FastAPI 基础](#4-fastapi-基础)
5. [数据库集成](#5-数据库集成)
6. [项目结构设计](#6-项目结构设计)
7. [实现 CRUD 功能](#7-实现-crud-功能)
8. [集成 AI 功能](#8-集成-ai-功能)
9. [错误处理和日志](#9-错误处理和日志)
10. [部署准备](#10-部署准备)

## 1. 环境准备

### 1.1 安装 Python
作为 JS 开发者，你熟悉 Node.js。Python 类似于 Node.js 运行时。

```bash
# 使用 mise（你提到你在用）
mise install python@3.11
mise use python@3.11

# 或使用系统包管理器
# macOS
brew install python@3.11

# 验证安装
python --version  # 应该显示 Python 3.11.x
```

### 1.2 理解 Python 虚拟环境
虚拟环境类似于 Node.js 项目中的 `node_modules`，但是是隔离的 Python 环境。

```bash
# 创建虚拟环境（类似于 npm init）
python -m venv venv

# 激活虚拟环境（类似于使用项目特定的 node_modules）
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

# 激活后，你的终端提示符会显示 (venv)
```

### 1.3 包管理器 pip
`pip` 是 Python 的包管理器，类似于 `npm`。

```bash
# 升级 pip
python -m pip install --upgrade pip

# 安装包（类似于 npm install）
pip install fastapi

# 安装开发依赖
pip install "uvicorn[standard]"  # 类似于 nodemon

# 查看已安装的包
pip list  # 类似于 npm list
```

## 2. Python 基础概念

### 2.1 Python vs JavaScript 语法对比

```python
# Python 注释使用 #
"""
多行注释使用三引号
类似 JS 的 /* */
"""

# 变量声明（不需要 let/const/var）
name = "John"  # 字符串
age = 30       # 整数
height = 5.9   # 浮点数
is_student = False  # 布尔值（注意大写）

# 列表（类似 JS 数组）
fruits = ["apple", "banana", "orange"]
fruits.append("grape")  # 类似 push()

# 字典（类似 JS 对象）
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

# 函数定义
def greet(name):
    return f"Hello, {name}!"  # f-string 类似模板字符串

# 类定义
class Person:
    def __init__(self, name, age):  # 构造函数
        self.name = name
        self.age = age
    
    def introduce(self):  # 方法
        return f"I'm {self.name}, {self.age} years old"

# 条件语句（注意冒号和缩进）
if age > 18:
    print("Adult")
elif age > 13:
    print("Teenager")
else:
    print("Child")

# 循环
for fruit in fruits:
    print(fruit)

# 导入模块（类似 import/require）
import os
from datetime import datetime
```

### 2.2 Python 特有概念

```python
# 类型提示（类似 TypeScript）
def add(a: int, b: int) -> int:
    return a + b

# 装饰器（类似 JS 装饰器提案）
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"耗时: {time.time() - start}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

# 异步编程（类似 async/await）
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "data"

# 上下文管理器（自动资源管理）
with open("file.txt", "r") as f:
    content = f.read()
# 文件自动关闭
```

## 3. 项目初始化

### 3.1 创建项目结构

```bash
mkdir fastapi-backend
cd fastapi-backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 创建项目结构
mkdir -p app/{api,core,db,models,schemas,services,utils}
touch app/__init__.py
touch app/{api,core,db,models,schemas,services,utils}/__init__.py
```

项目结构说明：
```
fastapi-backend/
├── venv/                 # 虚拟环境（类似 node_modules）
├── app/                  # 主应用目录
│   ├── __init__.py      # Python 包标识文件
│   ├── main.py          # 应用入口（类似 index.js）
│   ├── api/             # API 路由（类似 routes/）
│   ├── core/            # 核心配置（类似 config/）
│   ├── db/              # 数据库相关
│   ├── models/          # 数据模型（ORM）
│   ├── schemas/         # Pydantic 模型（请求/响应）
│   ├── services/        # 业务逻辑
│   └── utils/           # 工具函数
├── requirements.txt      # 依赖列表（类似 package.json）
└── .env                 # 环境变量
```

### 3.2 安装依赖

创建 `requirements.txt`：
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
pydantic==2.5.3
openai==1.8.0
```

安装所有依赖：
```bash
pip install -r requirements.txt
```

## 4. FastAPI 基础

### 4.1 创建第一个 API

创建 `app/main.py`：
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 创建 FastAPI 实例（类似 Express app）
app = FastAPI(
    title="Task API",
    description="A simple task management API",
    version="1.0.0"
)

# 配置 CORS（类似 Express CORS 中间件）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由定义（类似 Express 路由）
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
```

### 4.2 运行开发服务器

```bash
# 类似 npm run dev
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# app.main:app 解释：
# - app.main: app 目录下的 main.py 文件
# - :app: main.py 中的 app 变量
# --reload: 自动重载（类似 nodemon）
```

访问 http://localhost:8000 查看 API
访问 http://localhost:8000/docs 查看自动生成的 API 文档（Swagger UI）

## 5. 数据库集成

### 5.1 配置文件

创建 `app/core/config.py`：
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    应用配置类（类似 JS 中的 config 对象）
    使用 Pydantic 自动从环境变量读取配置
    """
    # 数据库配置
    DATABASE_URL: str
    
    # API 配置
    API_V1_STR: str = "/api/v1"
    
    # OpenAI 配置
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"  # 从 .env 文件读取

# 创建全局配置实例
settings = Settings()
```

创建 `.env` 文件：
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
OPENAI_API_KEY=your-api-key
```

### 5.2 数据库连接

创建 `app/db/database.py`：
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# 创建数据库引擎（类似数据库连接池）
engine = create_engine(settings.DATABASE_URL)

# 创建会话工厂（类似数据库连接）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类（所有模型继承此类）
Base = declarative_base()

# 依赖注入函数（获取数据库会话）
def get_db():
    """
    生成器函数，提供数据库会话
    类似 Express 中间件中的数据库连接
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 6. 项目结构设计

### 6.1 模型定义（Models）

创建 `app/models/task.py`：
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class Task(Base):
    """
    Task 数据库模型（类似 Sequelize/Prisma 模型）
    """
    __tablename__ = "tasks"
    
    # 列定义
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    completed = Column(Boolean, default=False)
    ai_summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 6.2 Schema 定义（请求/响应模型）

创建 `app/schemas/task.py`：
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# 基础 Task Schema（共享字段）
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    completed: bool = False

# 创建 Task 时的 Schema
class TaskCreate(TaskBase):
    pass

# 更新 Task 时的 Schema（所有字段可选）
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    completed: Optional[bool] = None

# 响应 Schema（包含所有字段）
class Task(TaskBase):
    id: int
    ai_summary: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        # 允许从 ORM 模型创建
        from_attributes = True

# AI Summary 请求 Schema
class TaskAISummary(BaseModel):
    task_id: int
    prompt: Optional[str] = None
```

### 6.3 数据库迁移（Alembic）

初始化 Alembic（类似 Prisma migrate）：
```bash
# 初始化 alembic
alembic init alembic

# 修改 alembic.ini 文件
# 找到 sqlalchemy.url 行，修改为：
# sqlalchemy.url = 从环境变量读取
```

修改 `alembic/env.py`：
```python
from app.core.config import settings
from app.db.database import Base
from app.models import task  # 导入所有模型

# 设置数据库 URL
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# 设置元数据
target_metadata = Base.metadata
```

创建和运行迁移：
```bash
# 创建迁移（类似 prisma migrate dev）
alembic revision --autogenerate -m "Initial migration"

# 运行迁移
alembic upgrade head
```

## 7. 实现 CRUD 功能

### 7.1 创建 API 路由

创建 `app/api/v1/tasks.py`：
```python
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.task import Task as TaskModel
from app.schemas.task import Task, TaskCreate, TaskUpdate, TaskAISummary
from app.services.ai_service import generate_task_summary

# 创建路由器（类似 Express Router）
router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],  # 用于文档分组
)

@router.get("/", response_model=List[Task])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)  # 依赖注入
):
    """获取任务列表"""
    tasks = db.query(TaskModel).offset(skip).limit(limit).all()
    return tasks

@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """获取单个任务"""
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """创建新任务"""
    db_task = TaskModel(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    """更新任务"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # 更新字段
    update_data = task.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """删除任务"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

@router.post("/{task_id}/ai-summary", response_model=Task)
async def generate_ai_summary(
    task_id: int,
    request: TaskAISummary,
    db: Session = Depends(get_db)
):
    """生成 AI 摘要"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # 调用 AI 服务
    summary = await generate_task_summary(db_task, request.prompt)
    
    # 更新任务
    db_task.ai_summary = summary
    db.commit()
    db.refresh(db_task)
    
    return db_task
```

### 7.2 注册路由

更新 `app/main.py`：
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import tasks
from app.core.config import settings

app = FastAPI(title="Task API")

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(
    tasks.router,
    prefix=settings.API_V1_STR
)

@app.get("/")
def read_root():
    return {"message": "Task API"}
```

## 8. 集成 AI 功能

### 8.1 创建 AI 服务

创建 `app/services/ai_service.py`：
```python
import openai
from typing import Optional
from app.core.config import settings
from app.models.task import Task

# 配置 OpenAI
openai.api_key = settings.OPENAI_API_KEY

async def generate_task_summary(
    task: Task,
    custom_prompt: Optional[str] = None
) -> str:
    """
    使用 OpenAI 生成任务摘要
    """
    # 构建提示
    prompt = custom_prompt or f"""
    请为以下任务生成一个简洁的摘要：
    
    标题：{task.title}
    描述：{task.description or '无描述'}
    状态：{'已完成' if task.completed else '进行中'}
    
    请用2-3句话总结这个任务的核心内容和重要性。
    """
    
    try:
        # 调用 OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "你是一个任务管理助手。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        # 错误处理
        return f"AI 摘要生成失败: {str(e)}"
```

## 9. 错误处理和日志

### 9.1 全局错误处理

更新 `app/main.py`：
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理器"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """请求日志中间件"""
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

### 9.2 自定义异常

创建 `app/core/exceptions.py`：
```python
class TaskNotFound(Exception):
    """任务不存在异常"""
    pass

class AIServiceError(Exception):
    """AI 服务异常"""
    pass
```

## 10. 部署准备

### 10.1 创建启动脚本

创建 `run.sh`：
```bash
#!/bin/bash

# 激活虚拟环境
source venv/bin/activate

# 运行数据库迁移
alembic upgrade head

# 启动服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 10.2 生产环境配置

创建 `gunicorn_config.py`：
```python
# Gunicorn 配置（生产环境 WSGI 服务器）
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
```

### 10.3 Docker 化（可选）

创建 `Dockerfile`：
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 运行服务
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 总结

### 关键概念对比

| JavaScript/Node.js | Python/FastAPI |
|-------------------|----------------|
| package.json | requirements.txt |
| npm/yarn | pip |
| node_modules | venv |
| Express | FastAPI |
| async/await | async/await |
| req, res | request, response |
| middleware | middleware/dependencies |
| Sequelize/Prisma | SQLAlchemy |
| Jest | pytest |
| nodemon | uvicorn --reload |

### 学习资源

1. **官方文档**
   - [FastAPI 文档](https://fastapi.tiangolo.com/)
   - [SQLAlchemy 文档](https://docs.sqlalchemy.org/)
   - [Pydantic 文档](https://docs.pydantic.dev/)

2. **推荐学习路径**
   - Python 基础语法
   - FastAPI 基础教程
   - SQLAlchemy ORM
   - 异步编程
   - 测试和部署

3. **实践建议**
   - 从简单的 CRUD 开始
   - 逐步添加复杂功能
   - 注重代码组织和最佳实践
   - 编写测试用例

### 下一步

1. 添加用户认证（JWT）
2. 实现文件上传
3. 添加缓存（Redis）
4. 编写单元测试
5. 配置 CI/CD

记住：Python 的哲学是"显式优于隐式"，这与 JavaScript 有所不同。花时间理解 Python 的思维方式，将帮助你写出更好的代码。

祝你学习愉快！🎉