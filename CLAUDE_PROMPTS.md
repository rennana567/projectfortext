# 用于 Claude 的中间 Prompt 示例

以下是开发 VoiceWave 组件过程中可能使用的中间 prompt，以及期望的 Claude 响应要点。

## Prompt 1: 技术方案咨询

**用户 Prompt**:
"我需要为移动端实现一个实时录音波形显示。请帮我选择合适的技术方案：应该使用 AnalyserNode 还是 AudioWorklet？考虑性能、兼容性和开发复杂度。"

**期望的 Claude 响应要点**:
- **技术对比**: AnalyserNode 更简单兼容性好，AudioWorklet 性能更好但复杂度高
- **推荐方案**: 对于移动端实时显示，AnalyserNode + 适当的帧率控制足够
- **关键代码片段**:
  ```typescript
  // AnalyserNode 基础用法
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  ```
- **性能建议**: 控制到 30fps，使用 requestAnimationFrame 节流

---

## Prompt 2: 移动端兼容性优化

**用户 Prompt**:
"我的波形组件在 iOS Safari 上无法正常工作。请帮我诊断可能的问题并提供修复方案。当前错误是 'The AudioContext was not allowed to start'。"

**期望的 Claude 响应要点**:
- **问题分析**: iOS Safari 的自动播放策略限制
- **解决方案**: 在用户交互事件中创建 AudioContext
- **修复代码**:
  ```typescript
  // 错误的方式（在组件挂载时创建）
  useEffect(() => {
    const audioContext = new AudioContext(); // ❌ 在 iOS 上会失败
  }, []);

  // 正确的方式（在用户点击时创建）
  const handleClick = async () => {
    const audioContext = new AudioContext(); // ✅ 用户交互后创建
    await audioContext.resume();
  };
  ```
- **额外建议**: 添加用户引导和错误处理

---

## Prompt 3: 性能优化请求

**用户 Prompt**:
"我的波形动画在低端手机上有些卡顿。请帮我优化性能，特别是减少不必要的重渲染和计算开销。"

**期望的 Claude 响应要点**:
- **性能分析**: 识别重渲染原因和计算瓶颈
- **优化策略**:
  - 使用 useCallback 和 useMemo 避免不必要的重计算
  - 降低帧率到 25-30fps
  - 优化 RMS 计算算法
- **代码改进**:
  ```typescript
  // 优化前的重计算
  const calculateRMS = (data) => {
    // 复杂计算...
  };

  // 优化后 - 使用 useCallback 和简化计算
  const calculateRMS = useCallback((data: Float32Array) => {
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) { // 采样减少
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / (data.length / 4));
  }, []);
  ```

---

## Prompt 4: 响应式布局改进

**用户 Prompt**:
"我需要波形柱子数量能根据容器宽度自动调整。请帮我实现一个响应式的 ResizeObserver 方案，确保柱子间距保持 6px。"

**期望的 Claude 响应要点**:
- **技术方案**: 使用 ResizeObserver 监听容器尺寸变化
- **计算逻辑**: 容器宽度 / (柱子宽度12px + 间距6px) = 柱子数量
- **实现代码**:
  ```typescript
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const newBarCount = Math.floor(width / 18); // 12px + 6px
      setBarCount(newBarCount);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);
  ```
- **边界处理**: 确保最小柱子数量，避免除零错误

---

## Prompt 5: 动画效果增强

**用户 Prompt**:
"当前的波形过渡有些生硬。请帮我添加更平滑的动画效果，类似 iPhone 语音备忘录的缓动过渡。"

**期望的 Claude 响应要点**:
- **动画分析**: 当前使用线性过渡，需要添加缓动函数
- **CSS 改进**: 使用 cubic-bezier 缓动函数
- **实现方案**:
  ```css
  .wave-bar {
    transition: height 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  ```
- **高级效果建议**:
  - 添加峰值保持效果
  - 实现波形渐隐动画
  - 考虑使用 Web Animations API 替代 CSS transition

---

## 后续迭代改进期望

### 视觉增强
- **粒子效果**: 在峰值时添加微小的粒子动画
- **峰值线**: 显示历史最高音量参考线
- **主题系统**: 支持暗色模式和多主题颜色
- **渐变色彩**: 根据音量强度显示颜色渐变

### 功能扩展
- **录音控制**: 添加暂停/继续功能
- **数据导出**: 支持波形数据导出为 JSON
- **自定义预设**: 允许用户保存喜欢的波形样式
- **手势交互**: 添加捏合缩放等手势控制

### 性能进阶
- **Web Workers**: 将音频计算移到 Worker 线程
- **AudioWorklet**: 升级到更高效的音频处理
- **虚拟化**: 对于超长录音实现波形虚拟化
- **缓存优化**: 添加波形数据缓存机制

### 兼容性完善
- **降级方案**: 为不支持 WebAudio 的浏览器提供备选方案
- **Polyfill**: 添加必要的 API polyfill
- **无障碍支持**: 完善键盘导航和屏幕阅读器支持

---

## 代码审查模式

当请求代码改进时，期望 Claude 提供 **diff 格式** 的修改建议：

```diff
- // 旧代码：性能较差的重渲染
- const VolumeDisplay = ({ data }) => {
-   return data.map(volume => (
-     <div style={{ height: volume * 100 }} />
-   ));
- };

+ // 新代码：优化后的版本
+ const VolumeDisplay = React.memo(({ data }) => {
+   return data.map((volume, index) => (
+     <div
+       key={index}
+       style={{
+         height: volume * 100,
+         transition: 'height 0.1s ease-out'
+       }}
+     />
+   ));
+ });
```

这种方式便于代码审查和增量改进。