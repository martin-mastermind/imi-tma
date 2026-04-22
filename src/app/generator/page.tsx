"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGeneration } from "@/context/GenerationContext";
import GeneratorScreen from "@/components/GeneratorScreen";
import { PAGE_TRANSITION } from "@/constants";
import type { UploadedImage } from "@/types";

export default function GeneratorPage() {
  const router = useRouter();
  const { state, generate } = useGeneration();

  const handleGenerate = async (
    prompt: string,
    modelId: string,
    selectedOptions: Record<string, string>,
    expectedPrice: number,
    images: UploadedImage[],
  ) => {
    await generate(prompt, modelId, selectedOptions, expectedPrice, images);
    router.push("/result");
  };

  return (
    <motion.div key="generator" {...PAGE_TRANSITION}>
      <GeneratorScreen
        onClose={() => router.push("/")}
        onGenerate={handleGenerate}
        isLoading={state.status === "loading"}
      />
    </motion.div>
  );
}
