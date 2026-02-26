# 使用 Node.js 20 作为基础镜像
FROM node:20-slim AS base

# 安装构建依赖 (better-sqlite3 需要编译)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建前端应用
RUN npm run build

# --- 运行阶段 ---
FROM node:20-slim AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 只复制必要的文件
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/server ./server
COPY --from=base /app/dist ./dist
COPY --from=base /app/public ./public

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]
