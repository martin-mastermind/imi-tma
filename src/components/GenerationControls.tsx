"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import type { PublicModel } from "@/lib/catalog";
import { computePrice } from "@/lib/catalog";
import StarIcon from "@/../public/icons/icon-star.svg";

interface GenerationControlsProps {
  model: PublicModel;
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>, price: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function GenerationControls({
  model,
  selectedOptions,
  onOptionsChange,
  onGenerate,
  isLoading,
}: GenerationControlsProps) {
  const price = useMemo(() => {
    return computePrice(model.id, selectedOptions);
  }, [model.id, selectedOptions]);

  const getOptionValues = (optionId: string) => {
    return model.options.find((opt) => opt.id === optionId)?.values || [];
  };

  const handleOptionChange = (optionId: string) => {
    const values = getOptionValues(optionId);
    if (values.length === 0) return;

    const currentValueId = selectedOptions[optionId];
    const currentIndex = values.findIndex((v) => v.id === currentValueId);
    const nextValueId = values[(currentIndex + 1) % values.length].id;

    const newOptions = { ...selectedOptions, [optionId]: nextValueId };
    onOptionsChange(newOptions, computePrice(model.id, newOptions));
  };

  const resolutionOption = model.options.find(
    (opt) => opt.id === "resolution",
  );
  const aspectRatioOption = model.options.find(
    (opt) => opt.id === "aspect_ratio",
  );

  const currentResolutionId = selectedOptions.resolution || "1K";
  const currentAspectRatioId = selectedOptions.aspect_ratio || "1:1";

  const currentResolutionValue = resolutionOption?.values.find(
    (v) => v.id === currentResolutionId,
  );
  const currentAspectRatioValue = aspectRatioOption?.values.find(
    (v) => v.id === currentAspectRatioId,
  );

  return (
    <div className="flex flex-col gap-[10px] mt-[29px] pl-4 pr-[13px]">
      <div className="flex gap-[6px] ml-[4px]">
        {aspectRatioOption && (
          <motion.button
            onClick={() => handleOptionChange("aspect_ratio")}
            className="h-[36px] px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[14px] flex items-center justify-center gap-[6px] shadow-sm"
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 14.75H5.75C2.75 14.75 0.75 13.5147 0.75 10.6324V4.86765C0.75 1.98529 2.75 0.75 5.75 0.75H15.75C18.75 0.75 20.75 1.98529 20.75 4.86765V10.6324C20.75 13.5147 18.75 14.75 15.75 14.75Z"
                stroke="#0E0F10"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{currentAspectRatioValue?.label || "1:1"}</span>
          </motion.button>
        )}
        {resolutionOption && (
          <motion.button
            onClick={() => handleOptionChange("resolution")}
            className="h-[36px] px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[14px] flex items-center justify-center shadow-sm"
            whileTap={{ scale: 0.95 }}
          >
            {currentResolutionValue?.label || "1K"}
          </motion.button>
        )}
      </div>

      <motion.button
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
  );
}
