import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export default function App() {
  /* ===== state ===== */

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('.');

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);

  const [cardType, setCardType] = useState<'home' | 'popup'>('home');
  const [count, setCount] = useState<number>(2);

  // 🔒 전송 중복 방지
  const sendingRef = useRef(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ===== effects ===== */

  // 타이핑 점 애니메이션
  useEffect(() => {
    if (!isTyping) return;

    const dots = ['.', '..', '...'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % dots.length;
      setTypingDots(dots[index]);
    }, 400);

    return () => clearInterval(interval);
  }, [isTyping]);

  // plugin → UI 메시지 수신
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = (event as any)?.data?.pluginMessage;
      if (!msg) return;

      if (msg.type === 'assistant-message') {
        setIsTyping(false);
        setTypingDots('.');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: msg.text },
        ]);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // 스크롤 자동 하단
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  /* ===== handlers ===== */

  const sendMessage = () => {
    if (sendingRef.current) return;

    const text = input.trim();
    if (!text) return;

    sendingRef.current = true;
    setIsTyping(true);

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');

    parent.postMessage(
      {
        pluginMessage: {
          type: 'user-message',
          text,
        },
      },
      '*'
    );

    setTimeout(() => {
      sendingRef.current = false;
    }, 0);
  };

  const resetChat = () => {
    setMessages([
      { role: 'assistant', text: '안녕하세요! 무엇을 도와드릴까요?' },
    ]);
    setInput('');
    setIsTyping(false);
    setTypingDots('.');
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.isComposing) return;
    if (e.repeat) return;

    if (e.key === 'Enter' && e.shiftKey) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ===== render ===== */

  return (
    <div style={styles.root}>
      {/* ===== Top Control ===== */}
      <div style={styles.topWrapper}>
        <div style={styles.topCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={styles.topTitle}>BannerMate</div>

            <div style={styles.optionRow}>
              <label style={styles.optionItem}>
                <input
                  type="radio"
                  checked={cardType === 'home'}
                  onChange={() => setCardType('home')}
                />
                Home Banner
              </label>
              <label style={styles.optionItem}>
                <input
                  type="radio"
                  checked={cardType === 'popup'}
                  onChange={() => setCardType('popup')}
                />
                Popup
              </label>
            </div>

            <div style={styles.countRow}>
              <input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
                style={styles.countInput}
              />
              <span style={styles.countLabel}>개</span>
            </div>
          </div>

          <button
            style={{ ...styles.buttonBase, ...styles.primaryButtonActive }}
            onClick={() =>
              parent.postMessage(
                {
                  pluginMessage: {
                    type: 'generate-template',
                    cardType,
                    count,
                  },
                },
                '*'
              )
            }
          >
            Generate
          </button>
        </div>
      </div>

      <div style={styles.sectionGap} />

      {/* ===== Chat ===== */}
      <div style={styles.bottomWrapper}>
        <div style={styles.chatCard}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <span style={{ fontSize: 12, color: '#605E5C' }}>
              AI와 대화 중
            </span>
            <button
              style={{
                ...styles.buttonBase,
                ...styles.secondaryButton,
                padding: '4px 8px',
                fontSize: 11,
              }}
              onClick={resetChat}
            >
              초기화
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m, i) => {
              const isError =
                m.role === 'assistant' &&
                m.text.includes('문제가 생겼어요');

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent:
                      m.role === 'user'
                        ? 'flex-end'
                        : 'flex-start',
                    marginBottom: 10,
                    marginTop: i === 0 ? 4 : 0,
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      ...(isError
                        ? styles.errorBubble
                        : m.role === 'user'
                        ? styles.userBubble
                        : styles.botBubble),
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    ...styles.botBubble,
                    opacity: 0.6,
                    fontStyle: 'italic',
                    minWidth: 24,
                  }}
                >
                  {typingDots}
                </div>
              </div>
            )}
          </div>

          {/* Input (messages 밖!) */}
          <div style={styles.inputBar}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요 (Enter: 전송 / Shift+Enter: 줄바꿈)"
              style={styles.textarea}
              rows={1}
            />
            <button
              onClick={sendMessage}
              style={{ ...styles.buttonBase, ...styles.primaryButtonActive }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
