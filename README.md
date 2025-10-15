a US medical school list
###How to commit change
git add .
git commit -m "描述你的修改"
git push

###Structure
- frontend: react+vite+tailwind+shadcnUI
- backend: expressJS+postgresql

###Basic info
Frontend use npm. To test run, go to ./frontend, npm run dev
Backend use ExpressJS, to run, go to ./backend, node server.js

##How to set up this project as a website.
###Create database
安装 PostgreSQL：
sudo apt update
sudo apt install postgresql postgresql-contrib -y

创建数据库和用户：
sudo -u postgres psql
CREATE USER school_user WITH PASSWORD 'YourPassword';
CREATE DATABASE school_db OWNER school_user;
GRANT ALL PRIVILEGES ON DATABASE school_db TO school_user;
\q

导入 schema：(在./backend 目录执行以下命令)
psql -U school_user -h localhost -d school_db -f schema.sql

###Pull the project
安装 Git：
sudo apt install git -y

拉取代码：
git clone https://github.com/ctbian1/intm.git
cd intm

###Build the frontend
进入前端目录：
cd frontend

安装依赖：
npm install

构建生产版本：
npm run build
生成的文件会在 frontend/dist/

配置 Nginx (把前端静态文件托管)：
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/school.conf

内容示例：
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

启用配置：
sudo ln -s /etc/nginx/sites-available/school.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

###Run the backend
编辑server.js
默认的域名:https://list.intm.top
如果你的域名不同，请搜索server.js里用到该域名的地方，替换为你要使用的域名url。
开发环境没有nginx反向代理，请替换为http+数据库IP。
生产环境替换成域名即可。

进入后端：
cd ../backend

安装依赖：
npm install

启动服务（临时）：
node server.js

建议用 PM2 来后台运行：
npm install -g pm2
pm2 start server.js --name school-backend
pm2 startup
pm2 save

###Finished.
前端访问： http://yourdomain.com

后端 API： http://yourdomain.com/schools

数据存储在 PostgreSQL school_db