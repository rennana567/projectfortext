import React, { useRef, useState } from "react";

interface VoiceWaveProps {
  width?: number;
  height?: number;
  themeColor?: string;
  gain?: number; // 放大倍数
}

const VoiceWave: React.FC<VoiceWaveProps> = ({
  width = 400,
  height = 80,
  themeColor = "#fff",
  gain = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // 控制柱状体数量
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      setIsRecording(true);
      draw(); // 开始绘制
    } catch (err) {
      console.error("麦克风访问失败:", err);
    }
  };

  // 停止录音
  const stopRecording = () => {
    setIsRecording(false);

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    if (sourceRef.current?.mediaStream) {
      sourceRef.current.mediaStream.getTracks().forEach((track) => track.stop());
    }

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
  };

  // 绘制波形
  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const analyser = analyserRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 6;
      const gap = 6;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // 将 0-255 映射到 -1 ~ 1
        const v = (dataArray[i] - 128) / 128;
        const barHeight = Math.max(12, Math.min(height, Math.abs(v) * height * gain));

        ctx.fillStyle = themeColor;
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);

        x += barWidth + gap;
      }

      animationIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} style={{ background: "#000", borderRadius: 8 }} />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            borderRadius: 20,
            border: "none",
            background: isRecording ? "#FF3B30" : "#007AFF",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isRecording ? "停止录音" : "开始录音"}
        </button>
      </div>
    </div>
  );
};

export default VoiceWave;
