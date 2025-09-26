import VoiceWave from './VoiceWave'
import './App.css'

function App() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        VoiceWave 实时录音波形
      </h1>

      <VoiceWave
        height={240}
        themeColor="#fff"
      />

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <h3 style={{ marginTop: '0' }}>功能特点：</h3>
        <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
          <li>🎯 <strong>真正实时显示</strong> - 使用 Canvas 直接绘制，无延迟</li>
          <li>📱 <strong>移动端兼容</strong> - 支持 iOS Safari 和 Android Chrome</li>
          <li>🔒 <strong>HTTPS 安全</strong> - 麦克风访问需要安全连接</li>
          <li>🎨 <strong>简洁可靠</strong> - 避免第三方库兼容性问题</li>
        </ul>
      </div>
    </div>
  )
}

export default App
