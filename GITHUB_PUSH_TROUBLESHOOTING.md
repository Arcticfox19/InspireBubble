# GitHub 推送问题排查指南

## 🔍 当前问题

```
fatal: unable to access 'https://github.com/Arcticfox19/InspireBubble.git/': 
Failed to connect to github.com port 443 after 21028 ms: Couldn't connect to server
```

这是网络连接问题，可能的原因：
1. 网络防火墙/代理设置
2. GitHub 访问受限
3. 网络不稳定
4. DNS 解析问题

## 🛠️ 解决方案

### 方案 1：检查网络连接

```powershell
# 测试 GitHub 连接
Test-NetConnection github.com -Port 443

# 测试 DNS 解析
nslookup github.com
```

### 方案 2：使用 SSH 代替 HTTPS（推荐）

如果 HTTPS 连接有问题，可以改用 SSH：

#### 步骤 1：检查是否已有 SSH 密钥

```powershell
# 检查是否存在 SSH 密钥
ls ~/.ssh
```

#### 步骤 2：如果没有，生成 SSH 密钥

```powershell
# 生成 SSH 密钥（将 your_email@example.com 替换为你的 GitHub 邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按 Enter 使用默认路径
# 设置密码（可选，直接按 Enter 跳过）
```

#### 步骤 3：添加 SSH 密钥到 GitHub

```powershell
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 或
Get-Content ~/.ssh/id_ed25519.pub
```

然后：
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 点击 "Add SSH key"

#### 步骤 4：更改远程仓库地址为 SSH

```powershell
# 移除现有的 HTTPS 远程地址
git remote remove origin

# 添加 SSH 远程地址
git remote add origin git@github.com:Arcticfox19/InspireBubble.git

# 验证
git remote -v

# 推送
git push -u origin main
```

### 方案 3：配置代理（如果需要）

如果你使用代理访问 GitHub：

```powershell
# 设置 Git 代理（将端口替换为你的代理端口）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 仅对 GitHub 设置代理
git config --global http.https://github.com.proxy http://127.0.0.1:7890

# 查看代理配置
git config --global --get http.proxy

# 取消代理（如果不需要）
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方案 4：使用 GitHub CLI（gh）

如果命令行推送有问题，可以使用 GitHub CLI：

```powershell
# 安装 GitHub CLI（如果未安装）
# 访问：https://cli.github.com/

# 登录
gh auth login

# 推送（gh 会自动处理认证）
git push
```

### 方案 5：稍后重试

有时只是临时网络问题，可以：
1. 等待几分钟后重试
2. 更换网络环境（如使用手机热点）
3. 使用 VPN（如果合法且允许）

### 方案 6：使用 GitHub Desktop

如果命令行一直有问题，可以使用 GitHub Desktop 图形界面：
1. 下载：https://desktop.github.com/
2. 登录 GitHub 账号
3. 添加本地仓库
4. 点击推送按钮

## ✅ 快速检查清单

- [ ] 网络连接正常
- [ ] 可以访问 https://github.com
- [ ] Git 配置正确（用户名和邮箱）
- [ ] 远程仓库地址正确
- [ ] 已提交本地更改

## 🔧 常用命令

```powershell
# 查看远程仓库配置
git remote -v

# 查看 Git 配置
git config --list

# 测试 SSH 连接
ssh -T git@github.com

# 查看网络连接
Test-NetConnection github.com -Port 443
```

## 📝 注意事项

1. **SSH vs HTTPS**：
   - SSH 通常更稳定，但需要配置密钥
   - HTTPS 更简单，但可能受网络限制

2. **代理设置**：
   - 如果使用代理，确保代理正常运行
   - 代理端口号要正确

3. **防火墙**：
   - 确保防火墙允许 Git 和 GitHub 连接
   - 某些公司网络可能阻止 GitHub 访问

## 🎯 推荐操作顺序

1. 先尝试方案 2（使用 SSH）- 最稳定
2. 如果不行，尝试方案 3（配置代理）
3. 如果还不行，使用方案 6（GitHub Desktop）
