import Image from "next/image";
import { motion } from "framer-motion";

interface TemplateCardProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function TemplateCard({
  name,
  imageUrl,
  isSelected,
  onClick,
}: TemplateCardProps) {
  return (
    <motion.div
      className={`relative w-[128px] h-[176px] rounded-[24px] overflow-hidden flex-shrink-0 cursor-pointer ${
        isSelected
          ? "ring-2 ring-white ring-offset-2 ring-offset-[#3c84dd]"
          : ""
      }`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <Image src={imageUrl} alt={name} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-[24px]" />
      <span className="absolute bottom-[10px] left-2 font-machina font-medium text-[14px] text-white leading-[17.5px]">
        {name}
      </span>
    </motion.div>
  );
}
