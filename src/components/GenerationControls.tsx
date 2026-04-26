"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicModel, PublicModelOption } from "@/lib/catalog";
import { computePrice } from "@/lib/catalog";
import StarIcon from "@/../public/icons/icon-star.svg";

interface GenerationControlsProps {
  model: PublicModel;
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>, price: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

function OptionSheet({
  option,
  selectedValueId,
  onSelect,
  onClose,
}: {
  option: PublicModelOption;
  selectedValueId: string;
  onSelect: (valueId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[#1a1b1c] rounded-t-[20px] overflow-hidden"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-[#3a3b3c]" />
        </div>
        <p className="px-4 pb-3 text-white font-norms font-medium text-[16px]">
          {option.label}
        </p>
        <div className="divide-y divide-[#2a2b2c]">
          {option.values.map((value) => {
            const isSelected = value.id === selectedValueId;
            return (
              <motion.button
                key={value.id}
                type="button"
                onClick={() => onSelect(value.id)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
                whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <span
                  className={`font-norms text-[15px] ${isSelected ? "text-white font-medium" : "text-[#9ca3af]"}`}
                >
                  {value.label}
                </span>
                {isSelected && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10l4.5 4.5L16 7"
                      stroke="#3c84dd"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default function GenerationControls({
  model,
  selectedOptions,
  onOptionsChange,
  onGenerate,
  isLoading,
}: GenerationControlsProps) {
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const price = useMemo(
    () => computePrice(model.id, selectedOptions),
    [model.id, selectedOptions],
  );

  const aspectRatioOption = model.options.find((opt) => opt.id === "aspect_ratio");
  const resolutionOption = model.options.find((opt) => opt.id === "resolution");

  const currentAspectRatioValue = aspectRatioOption?.values.find(
    (v) => v.id === (selectedOptions.aspect_ratio || "1:1"),
  );
  const currentResolutionValue = resolutionOption?.values.find(
    (v) => v.id === (selectedOptions.resolution || "1K"),
  );

  const activeOptionData = model.options.find((opt) => opt.id === activeOption) ?? null;

  const handleSelect = (valueId: string) => {
    if (!activeOption) return;
    const newOptions = { ...selectedOptions, [activeOption]: valueId };
    onOptionsChange(newOptions, computePrice(model.id, newOptions));
    setActiveOption(null);
  };

  return (
    <>
      <div className="flex flex-col gap-[10px] mt-[29px] pl-4 pr-[13px]">
        <div className="flex gap-[6px] ml-[4px]">
          {aspectRatioOption && (
            <motion.button
              type="button"
              onClick={() => setActiveOption("aspect_ratio")}
              className="h-[36px] px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[14px] flex items-center justify-center gap-[6px] shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path
                  d="M15.75 14.75H5.75C2.75 14.75 0.75 13.5147 0.75 10.6324V4.86765C0.75 1.98529 2.75 0.75 5.75 0.75H15.75C18.75 0.75 20.75 1.98529 20.75 4.86765V10.6324C20.75 13.5147 18.75 14.75 15.75 14.75Z"
                  stroke="#0E0F10"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{currentAspectRatioValue?.label ?? "1:1"}</span>
            </motion.button>
          )}
          {resolutionOption && (
            <motion.button
              type="button"
              onClick={() => setActiveOption("resolution")}
              className="h-[36px] px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[14px] flex items-center justify-center shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              {currentResolutionValue?.label ?? "1K"}
            </motion.button>
          )}
        </div>

        <motion.button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full h-[48px] bg-blue-accent rounded-[12px] text-white font-norms font-bold text-[14px] relative disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-[29px]"
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          <span className="pl-[56px] tracking-[-0.35px]">Создать фото</span>
          <span className="bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[10px] py-[6px] flex items-center justify-center gap-[6px] w-[64px] h-[26px]">
            <StarIcon className="ml-[-4px]" width={16} height={16} />
            <span className="text-[14px] font-medium leading-[20px]">{price}</span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {activeOption && activeOptionData && (
          <OptionSheet
            key={activeOption}
            option={activeOptionData}
            selectedValueId={selectedOptions[activeOption] ?? ""}
            onSelect={handleSelect}
            onClose={() => setActiveOption(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
