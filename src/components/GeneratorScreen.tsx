"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateCard from "./TemplateCard";
import UploadButton from "./UploadButton";
import ImagePreview from "./ImagePreview";
import type { AspectRatio, Resolution, UploadedImage } from "@/types";
import { validateImageFile, uploadImageFile } from "@/services/imageService";

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
    url: "https://www.figma.com/api/mcp/asset/da438f96-5383-47aa-a462-e603b6861e8c",
  },
  {
    name: "В небоскребе среди цветов",
    url: "https://www.figma.com/api/mcp/asset/8e021dd0-d31f-4b2e-8002-2c0b2f9b15b4",
  },
  {
    name: "Нежность",
    url: "https://www.figma.com/api/mcp/asset/3db66bb0-3f5f-41fb-b7cf-fe978179381f",
  },
  {
    name: "8 марта в стиле",
    url: "https://www.figma.com/api/mcp/asset/4b8494c7-4cc2-4ef0-b4d1-ec81e3c3ea31",
  },
  {
    name: "Море цветов",
    url: "https://www.figma.com/api/mcp/asset/70721ea2-6949-4af3-83fb-26ae465b6628",
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
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [selectedModel, setSelectedModel] = useState("Nano Banana Pro");
  const [modelOpen, setModelOpen] = useState(false);
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
    if (uploads.length >= 10) return;
    if (uploads.some((u) => u.label === `Шаблон ${template.name}`)) return;
    setUploads((u) => [
      ...u,
      {
        id: Math.random().toString(),
        dataUrl: template.url,
        label: `Шаблон ${template.name}`,
        isTemplate: true,
      },
    ]);
  };

  const handleRemoveUpload = (id: string) => {
    setUploads((u) => u.filter((img) => img.id !== id));
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Enter a prompt");
      return;
    }
    onGenerate(prompt, aspectRatio, resolution, uploads);
  };

  return (
    <div className="bg-bg-main min-h-screen text-text-light">
      <div className="bg-bg-main h-[40px] pt-4 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://www.figma.com/api/mcp/asset/0791e79d-1908-431d-abc4-4ac4312bb1ce"
            alt="photo"
            width={14}
            height={14}
          />
          <span className="text-text-muted text-[16px] font-norms font-medium leading-[24px]">
            Создание изображений
          </span>
          <Image
            src="https://www.figma.com/api/mcp/asset/fa8a6356-75c5-478d-983b-dad2429ff44a"
            alt="chevron"
            width={16}
            height={16}
          />
        </div>
        <motion.button
          onClick={onClose}
          className="bg-transparent rounded-[10px] p-2 hover:bg-[rgba(255,255,255,0.1)]"
          whileTap={{ scale: 0.9 }}
        >
          <Image
            src="https://www.figma.com/api/mcp/asset/8583dfe2-c3f1-483f-89cf-9fa6de9ba22c"
            alt="close"
            width={20}
            height={20}
          />
        </motion.button>
      </div>

      <div className="pb-[180px]">
        <div className="mx-4 mt-4 flex gap-3">
          {uploads.length > 0 ? (
            <div className="flex gap-3 w-full overflow-x-auto pb-2">
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 basis-0 min-w-[169px] h-[124px] rounded-[12px] border-2 border-dashed border-[rgba(255,255,255,0.1)] bg-[#0e0e0e] flex flex-col items-center justify-center"
                  tapScale={0.95}
                />
              )}
            </div>
          ) : (
            <UploadButton
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[125px] rounded-[12px] border-2 border-dashed border-[rgba(255,255,255,0.1)] bg-[#0e0e0e] flex flex-col items-center justify-center"
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

        <div className="relative mx-4 mt-4 bg-bg-card border border-[#343537] rounded-[12px]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Напишите что вы хотите создать?"
            className="w-full h-[138px] bg-transparent text-[#BFC9D9] text-[16px] font-norms placeholder-[#BFC9D9] p-4 outline-none resize-none"
          />
          <motion.button
            onClick={() => setModelOpen(!modelOpen)}
            className="border-t border-[#343537] font-medium px-4 py-3 flex justify-between items-center w-full bg-transparent hover:bg-[rgba(255,255,255,0.05)]"
            transition={{ duration: 0.2 }}
          >
            <label className="text-text-muted text-[13.9px] font-norms">
              Модель
            </label>
            <div className="flex items-center gap-2 text-white text-[14px] font-norms">
              <span>{selectedModel}</span>
              <motion.img
                src="https://www.figma.com/api/mcp/asset/fa8a6356-75c5-478d-983b-dad2429ff44a"
                alt="chevron"
                width={16}
                height={16}
                animate={{ rotate: modelOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: 16, height: 16 }}
              />
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

        <div className="mt-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-machina text-[20px] text-white">
              Фото шаблоны
            </h3>
            <a href="#" className="text-[#0067E7] text-[14px] font-norms">
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-bg-main p-4">
        <div className="flex gap-3 mb-4">
          <motion.button
            onClick={() => {
              const currentIndex = ASPECT_RATIOS.indexOf(aspectRatio);
              setAspectRatio(
                ASPECT_RATIOS[(currentIndex + 1) % ASPECT_RATIOS.length],
              );
            }}
            className="px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[16px] flex items-center justify-center gap-2 shadow-sm"
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
              setResolution(RESOLUTIONS[(currentIndex + 1) % RESOLUTIONS.length]);
            }}
            className="px-3 py-2 rounded-[12px] bg-[#C8D7E6] text-black font-norms font-medium text-[16px] flex items-center justify-center shadow-sm"
            whileTap={{ scale: 0.95 }}
          >
            {resolution}
          </motion.button>
        </div>
        <motion.button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-[48px] bg-blue-accent rounded-[12px] text-white font-norms font-bold text-[14px] relative disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          Создать фото
          <span className="bg-[rgba(255,255,255,0.1)] rounded-[10px] px-[10px] py-[6px] flex items-center justify-center gap-1 w-[64px] h-[26px]">
            <Image
              src="https://www.figma.com/api/mcp/asset/3ac13cf3-0ad4-4370-a684-98019c4beadc"
              alt="star"
              width={16}
              height={16}
            />
            <span className="text-[14px]">2</span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
