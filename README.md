a US medical school list
### How to commit change
```
git add .

git commit -m "描述你的修改"

git push
```

### Structure
- frontend: react+vite+tailwind+shadcnUI
- backend: expressJS+postgresql

### Basic info
Frontend use npm. To test run, go to ./frontend, npm run dev

Backend use ExpressJS, to run, go to ./backend, node server.js

## How to set up this project as a website.
### Create database
安装 PostgreSQL：
```
sudo apt update

sudo apt install postgresql postgresql-contrib -y
```
🔍 先确认你装的是什么版本
```
psql --version
```
会输出类似：
```
psql (PostgreSQL) 15.6
```
🚀 启动对应实例

假设是 15：
```
sudo systemctl start postgresql@15-main
sudo systemctl enable postgresql@15-main
```

如果是 14：
```
sudo systemctl start postgresql@14-main
sudo systemctl enable postgresql@14-main
```
✅ 检查状态
```
systemctl status postgresql@15-main
```

这时应该显示：
```
Active: active (running)
```
🎯 登录数据库测试
```
sudo -u postgres psql
```

如果能进到 postgres=#，说明服务已经起来了。


创建数据库和用户：
```
sudo -u postgres psql

CREATE USER school_user WITH PASSWORD 'YourPassword';

CREATE DATABASE school_db OWNER school_user;

GRANT ALL PRIVILEGES ON DATABASE school_db TO school_user;

\q
```
导入 schema：(在./backend 目录执行以下命令) [在pull project之后进行。]
```
psql -U school_user -h localhost -d school_db -f schema.sql
```

### Pull the project

安装 Git：
```
sudo apt install git -y
```
拉取代码：
```
git clone https://github.com/ctbian1/intm.git

cd intm
```
### Build the frontend
```
# 更新包列表
sudo apt update

# 安装 Node.js (推荐 LTS 版本，比如 20.x)
sudo apt install -y curl

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

进入前端目录：
```
cd frontend
```
安装依赖：
```
npm install --legacy-peer-deps
```
构建生产版本：
```
npm run build
```
生成的文件会在 frontend/dist/


配置 Nginx (把前端静态文件托管)：
```
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/school.conf
```

内容示例：
```
server {
    listen 80;
    server_name yourdomain.com;

    root /root/dev/school-list/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /schools {
        proxy_pass http://localhost:5000/schools;
    }
}
```
启用配置：
```
sudo ln -s /etc/nginx/sites-available/school.conf /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl restart nginx
```
#### 🔒 给 Nginx 配置 SSL（HTTPS + 自动续期）
1. 安装 Certbot 和 Nginx 插件

在 Debian/Ubuntu 系统：
```
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```
2. 申请 SSL 证书（自动修改 Nginx 配置）

假设你的域名是 example.com，并且已经正确解析到你的服务器 IP：
```
sudo certbot --nginx -d example.com -d www.example.com
```

它会自动：

验证域名（通过 Let’s Encrypt）

修改你的 /etc/nginx/sites-enabled/your-site.conf

给你配置好 80 → 443 重定向

过程中会问你是否强制 HTTPS，建议选 Yes

3. 测试自动续期

Let’s Encrypt 证书有效期只有 90 天，Certbot 会自动续期，你可以手动测试：
```
sudo certbot renew --dry-run
```
4. Certbot 自动续期（systemd/cron）

安装时 Certbot 已经自动配置了定时任务（/lib/systemd/system/certbot.timer）。
你可以确认：
```
systemctl list-timers | grep certbot
```
5. Nginx 配置文件（自动生成）

Certbot 会在 /etc/nginx/sites-enabled/ 给你生成类似：
```
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/intm/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

✅ 至此：

你的网站 https://example.com 就有了 SSL

Certbot 会自动续期

你不用手动干预

### Run the backend
编辑HomePage.jsx

默认的域名: http://yourdomainname.com

如果你的域名不同，请搜索Homepage.jsx里用到该域名的地方，替换为你要使用的域名url。

开发环境没有nginx反向代理，请替换为http+数据库IP。

生产环境替换成域名即可。


编辑server.js
输入数据库密码+server api auth密码
具体地点见下方：
```
// ⚠️ 数据库配置
const pool = new Pool({
  user: "school_user",
  host: "localhost",
  database: "school_db",
  password: "DatabasePassword123!", // 👉 修改成你自己的密码
  port: 5432,
});

// Basic Auth 配置
const authMiddleware = basicAuth({
  users: { admin: "mypassword" }, // 👉 修改成你自己的用户名和密码
  challenge: true,                 // 让浏览器弹出认证框
  unauthorizedResponse: "Unauthorized",
});
```

进入后端：
```
cd ../backend
```

安装依赖：
```
npm install --legacy-peer-deps
```

启动服务（临时）：
```
node server.js
```

建议用 PM2 来后台运行：
```
npm install -g pm2

pm2 start server.js --name school-backend

pm2 startup

pm2 save
```

### Finished.
前端访问： http://yourdomain.com

后端 API： http://yourdomain.com/schools

数据存储在 PostgreSQL school_db