import { motion } from "framer-motion";
import UploadIcon from "@/../public/icons/icon-upload.svg";

interface UploadButtonProps {
  onClick: () => void;
  inRow?: boolean;
  className?: string;
  tapScale?: number;
}

export default function UploadButton({
  onClick,
  inRow,
  className = "",
  tapScale = 0.95,
}: UploadButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileTap={{ scale: tapScale }}
    >
      <UploadIcon
        className={inRow ? "ml-[-1px] mt-[19px]" : "ml-[-1px]"}
        width={41}
        height={41}
      />
      <p
        className={
          inRow
            ? "flex flex-col items-center mt-[8px] ml-[3px] justify-center"
            : "flex items-center gap-[7px] ml-[-14px] mt-[4px]"
        }
      >
        <span className="text-text-muted text-[14px] font-norms">
          Загрузите изображения
        </span>
        <span className="text-[rgba(255,255,255,0.2)] text-[14px] font-norms">
          (до 10)
        </span>
      </p>
    </motion.button>
  );
}
