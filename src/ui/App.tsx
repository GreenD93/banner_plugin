// src/ui/App.tsx

import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';

type ChatMessage = {
  role: 'user' | 'bot';
  text?: string;
  images?: string[];
};

export default function App() {
  /* ===== state ===== */

  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ===== effects ===== */

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
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ===== handlers ===== */

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

  const resetChat = () => {
    setMessages([{ role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }]);
    setSelectedImages([]);
    setInput('');
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===== render ===== */

  return (
    <div style={styles.root}>

    <div style={styles.topWrapper}>
      <div style={styles.topCard}>
        <div>
          <div style={styles.topTitle}>Figma Assistant</div>
          <div style={styles.topDesc}>Template Extract & Render</div>
        </div>

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

          <button
            style={styles.resetButton}
            onClick={() =>
              parent.postMessage(
                { pluginMessage: { type: 'generate-template' } },
                '*'
              )
            }
          >
            Generate
          </button>
        </div>
      </div>
    </div>


      <div style={styles.sectionGap} />

      {/* Chat */}
      <div style={styles.bottomWrapper}>
        <div style={styles.chatCard}>
          {/* Messages */}
          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent:
                    m.role === 'user' ? 'flex-end' : 'flex-start',
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
                        <img
                          key={idx}
                          src={img}
                          style={styles.messageImage}
                        />
                      ))}
                    </div>
                  )}
                  {m.text && <div>{m.text}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Attachments */}
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

          {/* Input */}
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