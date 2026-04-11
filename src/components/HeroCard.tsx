"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroCardProps {
  title: string;
  image: string;
  tags?: string[][];
  height?: string;
  functional?: boolean;
  onClick?: () => void;
}

export default function HeroCard({
  title,
  image,
  tags,
  height = "h-[435px]",
  functional = false,
  onClick,
}: HeroCardProps) {
  return (
    <motion.div
      className={`mx-4 mt-4 rounded-[20px] overflow-hidden relative cursor-pointer group ${height}`}
      onClick={onClick}
      whileTap={functional ? { scale: 0.98 } : {}}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.3)] via-50% to-transparent" />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        {/* Title - positioned at bottom */}
        <div className="flex flex-col gap-3">
          <h3 className="font-machina font-medium text-[26px] text-white leading-[28.6px] whitespace-pre-line">
            {title}
          </h3>

          {/* Tags */}
          {tags && (
            <div className="flex flex-wrap gap-2">
              {tags.flat().map((tag) => (
                <span
                  key={tag}
                  className="bg-[rgba(15,16,18,0.65)] border border-[rgba(75,75,75,0.45)] rounded-[10px] px-3 py-2 text-white text-[14px] font-norms"
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
