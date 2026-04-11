import Image from "next/image";
import { motion } from "framer-motion";

interface UploadButtonProps {
  onClick: () => void;
  className?: string;
  tapScale?: number;
}

export default function UploadButton({
  onClick,
  className = "",
  tapScale = 0.95,
}: UploadButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileTap={{ scale: tapScale }}
    >
      <Image
        src="https://www.figma.com/api/mcp/asset/d524bbcb-27e6-44ed-b4b1-40cab322cde0"
        alt="upload"
        width={41}
        height={41}
      />
      <p className="text-text-muted text-[14px] font-norms mt-2">
        Загрузите изображения
      </p>
      <p className="text-[rgba(255,255,255,0.2)] text-[14px] font-norms">
        (до 10)
      </p>
    </motion.button>
  );
}
