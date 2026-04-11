import Image from "next/image";
import { motion } from "framer-motion";

interface ImagePreviewProps {
  imageUrl: string;
  templateName?: string;
  imageName: string;
  onDelete: () => void;
  className?: string;
}

export default function ImagePreview({
  imageUrl,
  templateName = "Шаблон",
  imageName,
  onDelete,
  className = "",
}: ImagePreviewProps) {
  return (
    <motion.div
      className={`relative w-[169px] flex flex-col gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="relative w-[169px] h-[124px] rounded-[8px] overflow-hidden group">
        {/* Image */}
        <Image
          src={imageUrl}
          alt={imageName}
          fill
          className="object-cover"
          sizes="169px"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 rounded-[8px]" />

        {/* Text Labels - Bottom Left Corner */}
        <div className="absolute bottom-[16px] left-[16px] flex flex-col gap-0 z-5 max-w-[137px]">
          <p className="text-[#B7BFCE] text-[12px] font-norms font-normal leading-[1.28] truncate">
            {templateName}
          </p>
          <p className="text-[#B7BFCE] text-[12px] font-norms font-medium leading-[1.28] truncate">
            {imageName}
          </p>
        </div>

        {/* Delete Button */}
        <motion.button
          onClick={onDelete}
          className="absolute top-[3px] right-[3px] w-[20px] h-[20px] z-10 flex items-center justify-center rounded-[6px] transition-colors"
          style={{ backgroundColor: "rgba(15, 15, 17, 0.75)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2L2 8M2 2L8 8"
              stroke="#9C9EA4"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
