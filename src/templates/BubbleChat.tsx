import { TemplateProps } from '@/types/template';
import { CARD_SIZES } from '@/utils/constants';

export const BubbleChat = ({
  title,
  dialogueItems,
  cardSize,
  cardIndex,
  totalCards,
}: TemplateProps) => {
  const size = CARD_SIZES[cardSize];

  return (
    <div
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundImage: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        className="bubble-chat-template"
        style={{
          width: '375px',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          borderRadius: '24px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(14, 165, 233, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* 纹理噪点遮罩 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.6,
            mixBlendMode: 'multiply',
          }}
        />

        {/* 标题区域 */}
        <div style={{ position: 'relative', zIndex: 3, marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              padding: '8px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            {title || '点击编辑标题'}
          </h1>
        </div>

        {/* 对话列表 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            zIndex: 3,
            flex: 1,
          }}
        >
          {dialogueItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                maxWidth: '100%',
                alignItems: 'flex-start',
                flexDirection: item.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* 头像 */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  flexShrink: 0,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  background:
                    item.role === 'user'
                      ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                      : '#ffffff',
                  color: item.role === 'user' ? '#fff' : '#0ea5e9',
                  border: item.role === 'user' ? 'none' : '1px solid #e2e8f0',
                }}
              >
                {item.role === 'user' ? 'ME' : 'AI'}
              </div>

              {/* 气泡内容 */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '18px',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  position: 'relative',
                  boxShadow:
                    item.role === 'user'
                      ? '0 4px 15px -3px rgba(14, 165, 233, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  maxWidth: 'calc(100% - 60px)',
                  background:
                    item.role === 'user'
                      ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                      : 'rgba(255, 255, 255, 0.85)',
                  color: item.role === 'user' ? '#ffffff' : '#1e293b',
                  border: item.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.9)',
                  borderTopRightRadius: item.role === 'user' ? '4px' : '18px',
                  borderTopLeftRadius: item.role === 'user' ? '18px' : '4px',
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* 底部装饰 */}
        <div
          style={{
            marginTop: '35px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#64748b',
            letterSpacing: '1px',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <span style={{ width: '20px', height: '1px', background: '#cbd5e1' }} />
          AI NOTE GENERATOR
          <span style={{ width: '20px', height: '1px', background: '#cbd5e1' }} />
        </div>

        {/* 页码（如果有多张） */}
        {totalCards > 1 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#999',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {cardIndex + 1} / {totalCards}
          </div>
        )}
      </div>
    </div>
  );
};
