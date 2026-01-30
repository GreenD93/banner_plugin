// src/ui/App.tsx

import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';

type ChatMessage = {
  role: 'user' | 'bot';
  text?: string;
  images?: string[];
};

export default function App() {
  /* =========================
   * State
   * ========================= */
  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);

  const [cardType, setCardType] = useState<'home' | 'popup'>('home');
  const [count, setCount] = useState<number>(2);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* =========================
   * Effects
   * ========================= */
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = (event as any)?.data?.pluginMessage;
      if (!msg) return;

      if (msg.type === 'image-selected') {
        setSelectedImages((prev) => [...prev, msg.dataUrl]);
      }

      if (msg.type === 'pong') {
        setMessages((prev) => [...prev, { role: 'bot', text: msg.text }]);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* =========================
   * Handlers
   * ========================= */
  const sendMessage = () => {
    if (!input && selectedImages.length === 0) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: input || undefined, images: selectedImages },
    ]);

    parent.postMessage(
      { pluginMessage: { type: 'ping', text: input, images: selectedImages } },
      '*'
    );

    setInput('');
    setSelectedImages([]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'generate-template',
          cardType,
          count,
        },
      },
      '*'
    );
  };

  /* =========================
   * Render
   * ========================= */
  return (
    <div style={styles.root}>
      {/* ================= Top Control ================= */}
      <div style={styles.topWrapper}>
        <div style={styles.topCard}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={styles.topTitle}>Figma Assistant</div>
              <div style={styles.topDesc}>Template Extract & Render</div>
            </div>

            {/* Card type */}
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="radio"
                  name="cardType"
                  checked={cardType === 'home'}
                  onChange={() => setCardType('home')}
                />
                Home Banner
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="radio"
                  name="cardType"
                  checked={cardType === 'popup'}
                  onChange={() => setCardType('popup')}
                />
                Popup
              </label>
            </div>

            {/* Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="number"
                min={1}
                value={count}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setCount(Number.isFinite(v) && v > 0 ? v : 1);
                }}
                style={{
                  width: 60,
                  padding: '4px 6px',
                  fontSize: 12,
                }}
              />
              <span style={{ fontSize: 12 }}>개 생성</span>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={styles.resetButton}
              onClick={() =>
                parent.postMessage(
                  { pluginMessage: { type: 'extract-template' } },
                  '*'
                )
              }
            >
              Extract
            </button>

            <button onClick={handleGenerate}>
              Generate
            </button>
          </div>
        </div>
      </div>

      <div style={styles.sectionGap} />

      {/* ================= Chat ================= */}
      <div style={styles.bottomWrapper}>
        <div style={styles.chatCard}>
          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    ...(m.role === 'user'
                      ? styles.userBubble
                      : styles.botBubble),
                  }}
                >
                  {m.images && (
                    <div style={styles.messageImages}>
                      {m.images.map((img, idx) => (
                        <img key={idx} src={img} style={styles.messageImage} />
                      ))}
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {selectedImages.length > 0 && (
            <div style={styles.attachmentBar}>
              {selectedImages.map((img, idx) => (
                <div key={idx} style={styles.attachmentItem}>
                  <img src={img} style={styles.attachmentImage} />
                  <button
                    style={styles.removeButton}
                    onClick={() => removeImage(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={styles.inputBar}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="메시지를 입력하세요"
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
