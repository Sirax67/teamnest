FROM node:20-slim

RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Baseline-версия Bun (без AVX2, работает на старых CPU)
RUN curl -fsSL https://github.com/oven-sh/bun/releases/download/bun-v1.1.34/bun-linux-x64-baseline.zip \
    -o /tmp/bun.zip \
    && unzip /tmp/bun.zip -d /tmp/bun-dir \
    && mv /tmp/bun-dir/bun-linux-x64-baseline/bun /usr/local/bin/bun \
    && chmod +x /usr/local/bin/bun \
    && rm -rf /tmp/bun.zip /tmp/bun-dir

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

RUN bunx --bun next build

EXPOSE 3000

CMD ["bun", "run", "start"]
