"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicModel } from "@/lib/catalog";
import ChevronIcon from "@/../public/icons/icon-chevron.svg";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function PromptInput({
  value,
  onChange,
  selectedModel,
  onModelChange,
}: PromptInputProps) {
  const [modelOpen, setModelOpen] = useState(false);
  const [models, setModels] = useState<PublicModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data: PublicModel[]) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
        setLoading(false);
      });
  }, []);

  const selectedModelData = models.find((m) => m.id === selectedModel);
  const displayLabel = selectedModelData?.label || selectedModel || "Модель";

  return (
    <div className="flex flex-col mx-[15px] mt-[19px] bg-bg-card border border-[#343537] rounded-[12px]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Напишите что вы хотите создать?"
        className="w-full h-[138px] bg-transparent text-[#BFC9D9] text-[16px] font-norms placeholder-[#BFC9D9] py-[20px] px-[17px] outline-none resize-none"
      />
      <motion.button
        onClick={() => setModelOpen(!modelOpen)}
        className="border-t border-[#343537] font-medium px-4 py-4 flex justify-between items-center w-full bg-transparent hover:bg-[rgba(255,255,255,0.05)]"
        transition={{ duration: 0.2 }}
      >
        <label className="text-text-muted text-[13.9px] font-norms">
          Модель
        </label>
        <div className="flex items-center gap-[10px] text-white text-[14px] font-norms">
          <span>{displayLabel}</span>
          <ChevronIcon width={16} height={16} className="text-white" />
        </div>
      </motion.button>
      <AnimatePresence>
        {modelOpen && (
          <motion.div
            className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#1a1b1c] border border-[#343537] rounded-[12px] z-20 py-2 origin-top"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="px-4 py-2 text-text-muted text-[14px]">
                Загрузка...
              </div>
            ) : (
              models.map((model) => (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setModelOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white text-[14px] hover:bg-[rgba(255,255,255,0.1)]"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.15 }}
                >
                  {model.label}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
