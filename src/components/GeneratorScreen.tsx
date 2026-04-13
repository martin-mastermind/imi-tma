"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateCard from "./TemplateCard";
import UploadButton from "./UploadButton";
import ImagePreview from "./ImagePreview";
import type { AspectRatio, Resolution, UploadedImage } from "@/types";
import { validateImageFile, uploadImageFile } from "@/services/imageService";

import CloseIcon from "@/../public/icons/icon-close.svg";
import PhotoIcon from "@/../public/icons/icon-photo.svg";
import ChevronIcon from "@/../public/icons/icon-chevron.svg";
import StarIcon from "@/../public/icons/icon-star.svg";

const MODELS = ["Nano Banana Pro"];
const ASPECT_RATIOS: AspectRatio[] = [
  "1:1",
  "4:3",
  "16:9",
  "9:16",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "21:9",
];
const RESOLUTIONS = ["1K", "2K", "4K"] as const;

const TEMPLATES = [
  {
    name: "Розовый портрет",
    url: "/images/template-pink-portrait.png",
    prompt: "Розовый портрет в нежных тонах",
  },
  {
    name: "В небоскребе среди цветов",
    url: "/images/template-skyscraper-flowers.png",
    prompt: "Городской пейзаж с небоскребом в окружении цветов",
  },
  {
    name: "Нежность",
    url: "/images/template-tenderness.png",
    prompt: "Нежное и чувственное изображение",
  },
  {
    name: "8 марта в стиле",
    url: "/images/template-march-8-style.png",
    prompt: "8 марта, праздничный стиль с цветами",
  },
  {
    name: "Море цветов",
    url: "/images/template-sea-flowers.png",
    prompt: "Красивое море цветов",
  },
];

interface GeneratorScreenProps {
  onClose: () => void;
  onGenerate: (
    prompt: string,
    aspectRatio: AspectRatio,
    resolution: Resolution,
    images: UploadedImage[],
  ) => void;
  isLoading: boolean;
}

export default function GeneratorScreen({
  onClose,
  onGenerate,
  isLoading,
}: GeneratorScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [selectedModel, setSelectedModel] = useState("Nano Banana Pro");
  const [modelOpen, setModelOpen] = useState(false);
  const [templatePrompts, setTemplatePrompts] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploads.length >= 10) return;
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        validateImageFile(file);
        const url = await uploadImageFile(file);
        setUploads((u) =>
          u.length >= 10
            ? u
            : [
                ...u,
                {
                  id: Math.random().toString(),
                  dataUrl: url,
                  label: file.name,
                  isTemplate: false,
                },
              ],
        );
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTemplateClick = async (template: (typeof TEMPLATES)[0]) => {
    const templateLabel = `Шаблон ${template.name}`;
    const isAlreadySelected = uploads.some((u) => u.label === templateLabel);

    if (isAlreadySelected) {
      // Remove template if already selected
      setUploads((u) => u.filter((img) => img.label !== templateLabel));
      setTemplatePrompts((p) =>
        p.filter((prompt) => prompt !== template.prompt),
      );
    } else {
      // Add template if not selected
      if (uploads.length >= 10) return;
      setUploads((u) => [
        ...u,
        {
          id: Math.random().toString(),
          dataUrl: template.url,
          label: templateLabel,
          isTemplate: true,
        },
      ]);
      // Add template prompt
      setTemplatePrompts((p) => [...p, template.prompt]);
    }
  };

  const handleRemoveUpload = (id: string) => {
    const uploadToRemove = uploads.find((img) => img.id === id);
    if (uploadToRemove && uploadToRemove.isTemplate) {
      // Find and remove the corresponding template prompt by matching the template name
      const templateName = uploadToRemove.label?.replace("Шаблон ", "");
      const template = TEMPLATES.find((t) => t.name === templateName);
      if (template) {
        setTemplatePrompts((p) =>
          p.filter((prompt) => prompt !== template.prompt),
        );
      }
    }
    setUploads((u) => u.filter((img) => img.id !== id));
  };

  const handleGenerate = () => {
    const finalPrompt = [prompt, ...templatePrompts]
      .filter((p) => p.trim())
      .join(". ");

    if (!finalPrompt.trim()) {
      alert("Enter a prompt");
      return;
    }
    onGenerate(finalPrompt, aspectRatio, resolution, uploads);
  };

  return (
    <div className="bg-bg-main min-h-screen text-text-light">
      <div className="bg-bg-main h-[40px] flex items-center justify-between pl-[14px] pr-[12px]">
        <div className="flex items-center mt-[15px] gap-[6px]">
          <PhotoIcon width={15} height={15} />
          <h2 className="flex gap-[6px] text-text-muted text-[16px] font-norms font-medium leading-[24px]">
            <span>Создание</span>
            <span>изображений</span>
          </h2>
          <ChevronIcon width={16} height={16} className="text-text-muted" />
        </div>
        <motion.button
          onClick={onClose}
          className="bg-transparent rounded-[10px] p-2 mt-[17px] hover:bg-[rgba(255,255,255,0.1)]"
          whileTap={{ scale: 0.9 }}
        >
          <CloseIcon width={20} height={20} />
        </motion.button>
      </div>

      <div className="pb-[180px]">
        <div className="mx-4 mt-4 flex gap-3">
          {uploads.length > 0 ? (
            <div className="flex gap-[7px] w-full overflow-x-auto">
              {uploads.map((img) => {
                const isTemplate = img.label?.startsWith("Шаблон");
                const imageName = isTemplate
                  ? img.label?.replace("Шаблон ", "")
                  : img.label || "";
                return (
                  <ImagePreview
                    key={img.id}
                    imageUrl={img.dataUrl}
                    templateName={isTemplate ? "Шаблон" : undefined}
                    imageName={imageName || ""}
                    onDelete={() => handleRemoveUpload(img.id)}
                  />
                );
              })}
              {uploads.length < 10 && (
                <UploadButton
                  inRow={true}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 basis-0 min-w-[169px] h-[125px] rounded-[12px] border border-dashed border-[rgba(255,255,255,0.1)] bg-[#0e0e0e] flex flex-col items-center justify-center"
                  tapScale={0.95}
                />
              )}
            </div>
          ) : (
            <UploadButton
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[125px] rounded-[12px] border border-dashed border-[rgba(255,255,255,0.1)] bg-[#0e0e0e] flex flex-col items-center justify-center"
              tapScale={0.98}
            />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col mx-[15px] mt-[19px] bg-bg-card border border-[#343537] rounded-[12px]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Напишите что вы хотите создать?"
            className="w-full h-[138px] bg-transparent text-[#BFC9D9] text-[16px] font-norms placeholder-[#BFC9D9] py-[20px] px-[17px] tracking-[-1%] outline-none resize-none"
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
              <span>{selectedModel}</span>
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
                {MODELS.map((model) => (
                  <motion.button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setModelOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white text-[14px] hover:bg-[rgba(255,255,255,0.1)]"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    transition={{ duration: 0.15 }}
                  >
                    {model}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-[20px] px-4">
          <div className="flex justify-between items-center mb-[15px]">
            <h3 className="font-machina text-[20px] text-white pl-[4px]">
              Фото шаблоны
            </h3>
            <a
              href="#"
              className="mt-[6px] w-[94px] text-[#0067E7] text-[14px] font-medium leading-[20px] font-inter"
            >
              Показать все
            </a>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
            {TEMPLATES.map((t) => (
              <TemplateCard
                key={t.name}
                name={t.name}
                imageUrl={t.url}
                isSelected={uploads.some((u) => u.label === `Шаблон ${t.name}`)}
                onClick={() => handleTemplateClick(t)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[10px] mt-[13px] pl-4 pr-[13px]">
          <div className="flex gap-[6px] ml-[4px]">
            <motion.button
              onClick={() => {
                const currentIndex = ASPECT_RATIOS.indexOf(aspectRatio);
                setAspectRatio(
                  ASPECT_RATIOS[(currentIndex + 1) % ASPECT_RATIOS.length],
                );
              }}
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
              <span>{aspectRatio}</span>
            </motion.button>
            <motion.button
              onClick={() => {
                const currentIndex = RESOLUTIONS.indexOf(resolution);
                setResolution(
                  RESOLUTIONS[(currentIndex + 1) % RESOLUTIONS.length],
                );
              }}
              className="h-[36px] px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[16px] flex items-center justify-center shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              {resolution}
            </motion.button>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-[48px] bg-blue-accent rounded-[12px] text-white font-norms font-bold text-[14px] relative disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-[29px]"
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <span className="pl-[56px] tracking-[-0.35px]">Создать фото</span>
            <span className="bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[10px] py-[6px] flex items-center justify-center gap-[6px] w-[64px] h-[26px]">
              <StarIcon className="ml-[-4px]" width={16} height={16} />
              <span className="text-[14px] font-medium leading-[20px]">2</span>
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
