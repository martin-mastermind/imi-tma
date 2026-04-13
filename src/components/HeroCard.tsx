"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroCardProps {
  title: string;
  image: string;
  tags?: string[][];
  height?: string;
  bottom?: string;
  functional?: boolean;
  onClick?: () => void;
}

export default function HeroCard({
  title,
  image,
  tags,
  height = "h-[435px]",
  bottom = "bottom-[32px]",
  functional = false,
  onClick,
}: HeroCardProps) {
  return (
    <motion.div
      className={`rounded-[20px] overflow-hidden relative cursor-pointer group ${height}`}
      onClick={onClick}
      whileTap={functional ? { scale: 0.98 } : {}}
    >
      <Image src={image} alt={title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.3)] via-50% to-transparent" />
      <div className={`absolute ${bottom} flex flex-col justify-end px-[32px]`}>
        <div className="flex flex-col gap-[19px]">
          <h3 className="font-machina font-medium text-[26px] text-white leading-[28.6px] whitespace-pre-line">
            {title}
          </h3>
          {tags && (
            <div className="flex flex-wrap gap-[13px]">
              {tags.flat().map((tag) => (
                <span
                  key={tag}
                  className="bg-[rgba(15,16,18,0.65)] border border-[rgba(75,75,75,0.45)] rounded-[10px] py-[9px] px-[12px] leading-[16px] tracking-[-0.4px] text-white text-[14px] font-norms"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
