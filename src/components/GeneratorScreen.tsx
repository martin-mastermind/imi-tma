"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";
import UploadButton from "./UploadButton";
import ImagePreview from "./ImagePreview";
import PromptInput from "./PromptInput";
import GenerationControls from "./GenerationControls";
import SectionHeader from "./SectionHeader";
import type { UploadedImage } from "@/types";
import { validateImageFile, uploadImageFile } from "@/services/imageService";
import { GENERATOR_TEMPLATES } from "@/constants";
import { newUploadId } from "@/lib/id";
import { computePrice } from "@/lib/catalog";
import type { PublicModel } from "@/lib/catalog";

import CloseIcon from "@/../public/icons/icon-close.svg";
import PhotoIcon from "@/../public/icons/icon-photo.svg";
import ChevronIcon from "@/../public/icons/icon-chevron.svg";
import GenerationWaitOverlay from "./GenerationWaitOverlay";

interface GeneratorScreenProps {
  onClose: () => void;
  onGenerate: (
    prompt: string,
    modelId: string,
    selectedOptions: Record<string, string>,
    expectedPrice: number,
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
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [models, setModels] = useState<PublicModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<PublicModel | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({
    resolution: "1K",
    aspect_ratio: "1:1",
    output_format: "jpg",
  });
  const [templatePrompts, setTemplatePrompts] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data: PublicModel[]) => {
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0]);
      })
      .catch((err) => console.error("Failed to load models:", err));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploads.length >= 10) return;
    const files = Array.from(e.target.files || []);
    setUploadError(null);
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
                  id: newUploadId(),
                  dataUrl: url,
                  label: file.name,
                  isTemplate: false,
                },
              ],
        );
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
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
          id: newUploadId(),
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
      setPromptError("Введите описание или выберите шаблон");
      return;
    }
    if (!selectedModel) {
      setPromptError("Выберите модель");
      return;
    }
    setPromptError(null);
    const expectedPrice = computePrice(selectedModel.id, selectedOptions);
    onGenerate(finalPrompt, selectedModel.id, selectedOptions, expectedPrice, uploads);
  };

  return (
    <div className="bg-bg-main min-h-screen text-text-light">
      <div className="bg-bg-main h-[40px] flex items-center justify-between pl-[14px] pr-[12px]">
        <div className="flex items-center mt-[15px] gap-[4px]">
          <PhotoIcon width={15} height={15} />
          <h2 className="ml-[2px] flex gap-[7px] text-text-muted text-[16px] font-norms font-medium leading-[24px]">
            <span>Создание</span>
            <span>изображений</span>
          </h2>
          <ChevronIcon width={16} height={16} className="text-text-muted" />
        </div>
        <motion.button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-disabled={isLoading}
          className="bg-transparent rounded-[10px] p-2 mt-[17px] hover:bg-[rgba(255,255,255,0.1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
          whileTap={isLoading ? undefined : { scale: 0.9 }}
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

        {uploadError ? (
          <p
            className="mx-4 mt-2 text-[14px] text-red-400 font-norms"
            role="alert"
          >
            {uploadError}
          </p>
        ) : null}

        <PromptInput
          value={prompt}
          onChange={(v) => {
            setPrompt(v);
            setPromptError(null);
          }}
          selectedModel={selectedModel?.id || ""}
          onModelChange={(modelId) => {
            const model = models.find((m) => m.id === modelId);
            if (model) {
              setSelectedModel(model);
              setSelectedOptions({
                resolution: "1K",
                aspect_ratio: "1:1",
                output_format: "jpg",
              });
            }
          }}
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

        {promptError ? (
          <p
            className="mt-2 px-4 text-[14px] text-red-400 font-norms"
            role="alert"
          >
            {promptError}
          </p>
        ) : null}

        {selectedModel && (
          <GenerationControls
            model={selectedModel}
            selectedOptions={selectedOptions}
            onOptionsChange={(options) => setSelectedOptions(options)}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}
      </div>

      {isLoading ? <GenerationWaitOverlay /> : null}
    </div>
  );
}
