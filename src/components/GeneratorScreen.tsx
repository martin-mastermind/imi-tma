"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";
import UploadButton from "./UploadButton";
import ImagePreview from "./ImagePreview";
import PromptInput from "./PromptInput";
import GenerationControls from "./GenerationControls";
import SectionHeader from "./SectionHeader";
import type { AspectRatio, Resolution, UploadedImage } from "@/types";
import { validateImageFile, uploadImageFile } from "@/services/imageService";
import { GENERATOR_TEMPLATES } from "@/constants";

import CloseIcon from "@/../public/icons/icon-close.svg";
import PhotoIcon from "@/../public/icons/icon-photo.svg";
import ChevronIcon from "@/../public/icons/icon-chevron.svg";

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

  const handleTemplateClick = async (
    template: (typeof GENERATOR_TEMPLATES)[0],
  ) => {
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
      const template = GENERATOR_TEMPLATES.find((t) => t.name === templateName);
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
          <h2 className="text-text-muted text-[16px] font-norms font-medium leading-[24px]">
            Создание изображений
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

      <div>
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

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        <div className="mt-[20px] px-4">
          <SectionHeader
            title="Фото шаблоны"
            showLink
            linkText="Показать все"
          />
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4">
            {GENERATOR_TEMPLATES.map((t) => (
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

        <GenerationControls
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          resolution={resolution}
          onResolutionChange={setResolution}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
