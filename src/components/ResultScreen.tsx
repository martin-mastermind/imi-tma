"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import CloseIcon from "@/../public/icons/icon-close.svg";
import PhotoIcon from "@/../public/icons/icon-photo.svg";
import ChevronIcon from "@/../public/icons/icon-chevron.svg";

interface TelegramWindow extends Window {
  Telegram?: { WebApp?: { initData?: string } };
}

interface ResultScreenProps {
  variant: "success" | "error";
  imageUrl?: string;
  error?: string;
  failCode?: string | null;
  failMsg?: string | null;
  onBack: () => void;
  onReset: () => void;
}

const BTN_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent/50";

async function fetchImageBlobViaProxy(
  imageUrl: string,
): Promise<{ blob: Blob; mime: string } | null> {
  const proxy = `/api/fetch-image?url=${encodeURIComponent(imageUrl)}`;
  const res = await fetch(proxy);
  if (!res.ok) return null;
  const blob = await res.blob();
  const fromHeader = res.headers.get("content-type")?.split(";")[0]?.trim();
  const mime =
    blob.type && blob.type !== "application/octet-stream"
      ? blob.type
      : fromHeader && fromHeader.startsWith("image/")
        ? fromHeader
        : "image/jpeg";
  return { blob, mime };
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

function hapticSuccess() {
  if (typeof window === "undefined") return;
  try {
    const tg = (
      window as Window & {
        Telegram?: {
          WebApp?: {
            HapticFeedback?: {
              notificationOccurred: (type: "success") => void;
            };
          };
        };
      }
    ).Telegram?.WebApp?.HapticFeedback;
    tg?.notificationOccurred?.("success");
  } catch {
    /* unsupported */
  }
}

function ResultHeader({
  title,
  onReset,
}: {
  title: string;
  onReset: () => void;
}) {
  return (
    <div className="bg-bg-main h-[40px] flex items-center justify-between pl-[14px] pr-[12px] shrink-0">
      <div className="flex items-center mt-[15px] gap-[4px] min-w-0">
        <PhotoIcon width={15} height={15} className="shrink-0" />
        <h2 className="ml-[2px] text-text-muted text-[16px] font-norms font-medium leading-[24px] truncate">
          {title}
        </h2>
        <ChevronIcon width={16} height={16} className="text-text-muted shrink-0" />
      </div>
      <motion.button
        type="button"
        onClick={onReset}
        className={`bg-transparent rounded-[10px] p-2 mt-[17px] hover:bg-[rgba(255,255,255,0.1)] ${BTN_FOCUS}`}
        whileTap={{ scale: 0.9 }}
        aria-label="На главную"
      >
        <CloseIcon width={20} height={20} />
      </motion.button>
    </div>
  );
}

function ErrorIllustration() {
  return (
    <div
      className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,59,48,0.12)]"
      aria-hidden
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-red-400"
      >
        <path
          d="M12 8v5M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function BottomActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-gradient-to-t from-black/90 via-black/55 to-transparent backdrop-blur-sm pt-10 px-4 shrink-0"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      {children}
    </div>
  );
}

export default function ResultScreen({
  variant,
  imageUrl,
  error,
  failCode,
  failMsg,
  onBack,
  onReset,
}: ResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<"pending" | "sent" | "error">("pending");
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  useEffect(() => {
    if (variant !== "success" || !imageUrl) return;
    const initData = (window as TelegramWindow).Telegram?.WebApp?.initData;
    if (!initData) { setSendStatus("error"); return; }
    fetch("/api/telegram/send-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, imageUrl }),
    })
      .then(r => setSendStatus(r.ok ? "sent" : "error"))
      .catch(() => setSendStatus("error"));
  }, [variant, imageUrl]);

  const scheduleCopiedReset = () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!imageUrl || saving) return;
    setSaveError(null);
    setSaving(true);
    let objectUrl: string | null = null;
    try {
      const data = await fetchImageBlobViaProxy(imageUrl);
      if (!data) {
        setSaveError("Не удалось загрузить изображение. Попробуйте ещё раз.");
        return;
      }
      objectUrl = URL.createObjectURL(data.blob);
      const ext = extensionForMime(data.mime);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `imi-generated.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      hapticSuccess();
    } catch {
      setSaveError("Не удалось сохранить изображение");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!imageUrl) return;
    setCopyError(null);
    try {
      const data = await fetchImageBlobViaProxy(imageUrl);
      if (data) {
        const type =
          data.mime && data.mime.startsWith("image/")
            ? data.mime
            : "image/jpeg";
        await navigator.clipboard.write([
          new ClipboardItem({ [type]: data.blob }),
        ]);
        setCopied(true);
        scheduleCopiedReset();
        hapticSuccess();
        return;
      }
    } catch {
      /* try text fallback */
    }

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      scheduleCopiedReset();
      hapticSuccess();
    } catch {
      setCopyError("Не удалось скопировать изображение");
    }
  };

  if (variant === "error") {
    const primary =
      (typeof failMsg === "string" && failMsg.trim()) ||
      error ||
      "Не удалось создать изображение";
    const showCode = failCode != null && String(failCode).trim() !== "";

    return (
      <motion.div
        className="bg-bg-main min-h-screen relative flex flex-col text-text-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ResultHeader title="Ошибка" onReset={onReset} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <ErrorIllustration />
          <p className="text-white font-norms text-[17px] font-medium leading-snug mb-2">
            Не получилось
          </p>
          <p className="text-text-muted font-norms text-[15px] leading-relaxed max-w-[320px]">
            {primary}
          </p>
          {showCode ? (
            <p className="mt-4 w-full max-w-[320px] rounded-[12px] bg-[#1e1f23] px-3 py-2 text-left text-[13px] text-text-muted font-mono">
              Код: {String(failCode)}
            </p>
          ) : null}
        </div>

        <BottomActions>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onBack}
              className={`flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium text-[14px] ${BTN_FOCUS}`}
              whileTap={{ scale: 0.97 }}
            >
              Назад
            </motion.button>
            <motion.button
              type="button"
              onClick={onReset}
              className={`flex-1 h-[48px] bg-blue-accent text-white rounded-[12px] font-norms font-bold text-[14px] ${BTN_FOCUS}`}
              whileTap={{ scale: 0.97 }}
            >
              На главную
            </motion.button>
          </div>
        </BottomActions>
      </motion.div>
    );
  }

  if (!imageUrl) {
    return (
      <motion.div
        className="bg-bg-main min-h-screen flex flex-col text-text-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ResultHeader title="Нет изображения" onReset={onReset} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e1f23]"
            aria-hidden
          >
            <PhotoIcon width={28} height={28} className="text-text-muted" />
          </div>
          <p className="text-text-muted text-center font-norms text-[15px] leading-relaxed max-w-[280px]">
            Изображение недоступно. Вернитесь и попробуйте создать снова.
          </p>
          <motion.button
            type="button"
            onClick={onBack}
            className={`w-full max-w-[320px] h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium text-[14px] ${BTN_FOCUS}`}
            whileTap={{ scale: 0.97 }}
          >
            Назад
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-bg-main min-h-screen relative flex flex-col text-text-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResultHeader title="Результат" onReset={onReset} />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="px-4 pt-2 pb-1 shrink-0">
          <p className="text-text-muted text-[13px] font-norms">Готово</p>
          <p className="text-text-light text-[15px] font-norms font-medium leading-snug">
            Изображение готово
          </p>
          <p className="text-text-muted text-[12px] font-norms mt-[2px]" aria-live="polite">
            {sendStatus === "pending" && "Отправляем в Telegram…"}
            {sendStatus === "sent" && "Отправлено в чат ✓"}
          </p>
        </div>
        <div className="relative min-h-[200px] flex-1">
          <Image
            src={imageUrl}
            alt="Сгенерированное изображение"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      </div>

      <BottomActions>
        <div
          className="mb-3 min-h-[20px] text-center text-[13px] font-norms text-text-muted"
          aria-live="polite"
        >
          {copied ? "Изображение скопировано в буфер" : "\u00a0"}
        </div>
        {saveError ? (
          <p
            className="text-center text-[14px] text-red-400 font-norms mb-3"
            role="alert"
          >
            {saveError}
          </p>
        ) : null}
        {copyError ? (
          <p
            className="text-center text-[14px] text-red-400 font-norms mb-3"
            role="alert"
          >
            {copyError}
          </p>
        ) : null}
        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
            className={`flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] bg-blue-accent font-norms text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 ${BTN_FOCUS}`}
            whileTap={saving ? undefined : { scale: 0.98 }}
          >
            {saving ? (
              <>
                <span
                  className="inline-block size-4 shrink-0 rounded-full border-2 border-white/35 border-t-white animate-spin"
                  aria-hidden
                />
                Сохранение…
              </>
            ) : (
              "Сохранить"
            )}
          </motion.button>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onBack}
              className={`flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium text-[14px] ${BTN_FOCUS}`}
              whileTap={{ scale: 0.97 }}
            >
              Назад
            </motion.button>
            <motion.button
              type="button"
              onClick={handleCopy}
              disabled={saving}
              className={`flex-1 h-[48px] bg-[#1e1f23] text-white rounded-[12px] font-norms font-medium text-[14px] relative disabled:opacity-60 disabled:cursor-not-allowed ${BTN_FOCUS}`}
              whileTap={saving ? undefined : { scale: 0.97 }}
            >
              {copied ? "✓ Скопировано" : "Копировать"}
            </motion.button>
          </div>
        </div>
      </BottomActions>
    </motion.div>
  );
}
