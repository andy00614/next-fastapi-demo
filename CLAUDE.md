# 目标
我现在要做一个脚手架，这个脚手架帮助我基于 fastapi 和 next.js 去快速构建一个 AI 全栈应用
- 它是monorepo的结构，基于 pnpm workspace
- 它的前端是 next.js，后端是 fastapi
- 它的数据库是 postgresql(Neon)
- 前端基于 https://github.com/justnode/better-saas.git 这个脚手架，它里面包含了很多东西，其中认证我会用它这里面的
- 数据库的用户认证我会用 https://github.com/justnode/better-saas.git 这个脚手架里面，其他都用 fastapi 去实现
- 数据库的中： 	•	🚫 前端不负责迁移 •	✅ 所有结构更改（新增字段、表）都从 Python 后端操作。
- fastapi 的目录设计要符合最佳实践
- 最后请给我一个实例，一个简单的势力，包含增删改查，和AI操作
- 我的数据库的地址是这个
- ai的环境变量
- 我的本地环境基于mise，可以随意切换node,python版本