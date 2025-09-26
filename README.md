# VoiceWave - 移动端实时录音音量显示组件

一个基于 React + TypeScript 的移动端实时录音音量显示组件，提供类似 iPhone 语音备忘录的竖向圆角条柱状波形效果。

## 功能特性

- 📱 **移动端优化** - 专为 iOS Safari 和 Android Chrome 设计
- 🎤 **实时录音** - 使用 WebAudio API 获取麦克风输入
- 📊 **波形显示** - 竖向圆角条柱状波形，类似 iPhone 语音备忘录
- 🎨 **响应式设计** - 自动适配容器宽度，柱子数量动态调整
- ⚡ **性能优化** - 帧率控制、节流渲染、轻量计算
- 🔧 **高度可定制** - 支持主题色、帧率、尺寸等参数配置

## 技术栈

- **React 19** + **TypeScript**
- **WebAudio API** (AnalyserNode)
- **Vite** 构建工具
- **CSS3** 动画与过渡效果

## 快速开始

### 环境要求

- Node.js 18+
- 现代浏览器（支持 WebAudio API）
- HTTPS 环境（移动端麦克风访问必需）

### 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 本地开发

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 移动设备测试

由于安全限制，移动设备测试需要 HTTPS 环境：

#### 方法一：使用本地 HTTPS

```bash
# 使用 mkcert 创建本地证书
npm install -g mkcert
mkcert -install
mkcert localhost

# 修改 vite.config.ts 启用 HTTPS
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    host: '0.0.0.0'
  }
})
```

#### 方法二：使用 ngrok 隧道

```bash
# 安装 ngrok
npm install -g ngrok

# 启动本地服务后，创建隧道
ngrok http 5173
```

访问 ngrok 提供的 HTTPS URL 进行测试。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 组件使用

### 基础用法

```tsx
import VoiceWave from './VoiceWave';

function App() {
  return (
    <VoiceWave
      width="100%"
      height={150}
      fps={30}
      themeColor="#007AFF"
    />
  );
}
```

### Props 配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | number \| string | `'100%'` | 组件宽度 |
| `height` | number | `80` | 组件高度（px） |
| `barCount` | number | `20` | 初始柱子数量 |
| `fps` | number | `30` | 帧率控制 |
| `themeColor` | string | `'#007AFF'` | 主题颜色 |

## 兼容性说明

### 浏览器支持

- ✅ Chrome 60+
- ✅ Safari 11+
- ✅ Firefox 55+
- ✅ Edge 79+

### 移动端限制

1. **HTTPS 要求**：移动端必须使用 HTTPS 才能访问麦克风
2. **用户交互**：必须在用户交互（点击）后初始化音频上下文
3. **自动播放策略**：iOS Safari 有严格的自动播放限制
4. **权限请求**：首次使用需要用户明确授权麦克风访问

### iOS Safari 特殊处理

- 使用 `webkitAudioContext` 兼容旧版本
- 音频上下文必须在用户手势事件中创建
- 避免在页面加载时自动开始录音

## 性能优化

### 帧率控制

组件通过 `requestAnimationFrame` 和帧率参数控制更新频率，避免过度渲染。

### 轻量计算

- 使用 `getFloatTimeDomainData()` 而非 `getByteFrequencyData()` 减少数据转换
- RMS 计算优化，避免不必要的数学运算
- 使用 `useCallback` 和 `useMemo` 优化重渲染

### 内存管理

- 正确清理音频上下文和媒体流
- 使用 `ResizeObserver` 监听容器大小变化
- 组件卸载时自动停止录音和动画

## 开发指南

### 核心实现原理

1. **音频处理**：通过 `AnalyserNode` 获取时域数据，计算 RMS 音量
2. **波形显示**：将音量值映射到 12-58px 高度范围
3. **动画效果**：使用 CSS `transition` 实现平滑高度变化
4. **响应式布局**：基于容器宽度动态计算柱子数量

### 自定义扩展

可以扩展以下功能：

- 添加峰值指示器
- 实现不同主题（暗色模式）
- 添加录音数据导出
- 集成音频可视化效果

## 故障排除

### 常见问题

**Q: 麦克风权限被拒绝**
A: 确保使用 HTTPS，检查浏览器权限设置

**Q: iOS 上没有声音**
A: 确认音频上下文在用户交互事件中创建

**Q: 波形不更新**
A: 检查控制台错误，确认 AnalyserNode 正确连接

### 调试技巧

```javascript
// 在浏览器控制台检查音频状态
console.log('AudioContext state:', audioContext.state);
console.log('Analyser connected:', analyser.numberOfInputs > 0);
```

## 许可证

MIT License