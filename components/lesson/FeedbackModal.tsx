// components/lesson/FeedbackModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  message: string;
  nextLessonId?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export default function FeedbackModal({
  isOpen,
  isCorrect,
  message,
  nextLessonId,
  onClose,
  onRetry,
}: FeedbackModalProps) {
  const router = useRouter();

  const handleNextLesson = () => {
    if (nextLessonId) {
      router.push(`/lessons/${nextLessonId}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 弹窗内容 */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-panel/90 border border-ink/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 顶部装饰 */}
              <div
                className={`h-2 ${
                  isCorrect
                    ? 'bg-gradient-to-r from-accent2 to-accent2/80'
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
              />

              <div className="p-8">
                {/* 图标 */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-accent2/12' : 'bg-red-500/10'
                    }`}
                  >
                    <span className="text-5xl">
                      {isCorrect ? '🎉' : '💡'}
                    </span>
                  </div>
                </div>

                {/* 标题 */}
                <h3
                  className={`text-2xl font-bold text-center mb-4 ${
                    isCorrect ? 'text-accent2' : 'text-red-400'
                  }`}
                >
                  {isCorrect ? '答案正确！' : '再试一次'}
                </h3>

                {/* 消息 */}
                <p className="text-ink/70 text-center leading-relaxed mb-8">
                  {message}
                </p>

                {/* 按钮组 */}
                <div className="flex gap-3">
                  {isCorrect ? (
                    <>
                      <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1"
                      >
                        继续学习
                      </Button>
                      {nextLessonId && (
                        <Button
                          onClick={handleNextLesson}
                          variant="primary"
                          className="flex-1"
                        >
                          下一课 →
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1"
                      >
                        关闭
                      </Button>
                      {onRetry && (
                        <Button
                          onClick={() => {
                            onRetry();
                            onClose();
                          }}
                          variant="primary"
                          className="flex-1"
                        >
                          重新尝试
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
