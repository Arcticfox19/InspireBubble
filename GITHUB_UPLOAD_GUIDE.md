# GitHub 上传指南

## ✅ 已完成
- ✅ Git 仓库已初始化
- ✅ 所有文件已添加到暂存区
- ✅ 初始提交已创建（47 个文件，8118 行代码）

## 📋 下一步：连接到 GitHub 并推送

### 方法一：通过 GitHub 网页创建仓库（推荐）

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角的 `+` 按钮，选择 `New repository`
   - 仓库名称建议：`xhs-layout-tool` 或 `xhs-paiban-tool`
   - 描述：`小红书排版工具 - 将对话转换为精美卡片图片`
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
   - 选择 Public 或 Private
   - 点击 `Create repository`

3. **连接本地仓库到 GitHub**
   
   在项目目录下执行以下命令（将 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替换为你的实际值）：
   
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

   **示例**：
   ```bash
   git remote add origin https://github.com/yourusername/xhs-layout-tool.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：使用 SSH（如果已配置 SSH 密钥）

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🔐 认证说明

### 如果使用 HTTPS（方法一）
- **首次推送**：GitHub 会要求你输入用户名和密码
- **密码**：需要使用 **Personal Access Token (PAT)**，而不是 GitHub 密码
  - 生成 Token：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - 权限：至少勾选 `repo` 权限
  - 复制生成的 token，在输入密码时使用这个 token

### 如果使用 SSH（方法二）
- 需要先配置 SSH 密钥
- 参考：https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## 📝 常用 Git 命令

### 查看远程仓库
```bash
git remote -v
```

### 推送代码
```bash
git push
```

### 拉取代码
```bash
git pull
```

### 查看提交历史
```bash
git log --oneline
```

### 查看状态
```bash
git status
```

## 🎯 快速执行命令

创建仓库后，直接复制以下命令并替换 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 将分支重命名为 main（GitHub 默认分支名）
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## ⚠️ 注意事项

1. **备份文件**：`wysiwyg-generator cp.ts` 是备份文件，已包含在仓库中
2. **分析文档**：`AVATAR_TEXT_POSITION_FIX_PLAN.md`、`EXPORT_ISSUES_ANALYSIS.md` 等分析文档已包含
3. **敏感信息**：确保 `.env` 文件已在 `.gitignore` 中（已配置）
4. **node_modules**：已排除，不会上传到 GitHub

## 🚀 后续操作

推送成功后，你可以：
- 在 GitHub 网页查看代码
- 设置仓库描述、标签、README 等
- 配置 GitHub Pages（如果需要）
- 邀请协作者
- 创建 Issues 和 Pull Requests
