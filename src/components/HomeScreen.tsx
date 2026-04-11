"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import AgentCard from "./AgentCard";
import Input from "./Input";
import HeroCard from "./HeroCard";

const AGENTS = [
  {
    name: "Сценарист Reels",
    url: "https://www.figma.com/api/mcp/asset/35110d8b-35b4-4e92-9414-e7ecb9b46dac",
  },
  {
    name: "SMM-Менеджер",
    url: "https://www.figma.com/api/mcp/asset/9b8012c7-e7e7-43d6-9159-168d200a62d2",
  },
  {
    name: "ИИ-фотограф",
    url: "https://www.figma.com/api/mcp/asset/7a5d5964-f41c-459b-9f15-e6cebcfd0153",
  },
  {
    name: "Нейрофотограф",
    url: "https://www.figma.com/api/mcp/asset/50b946bf-1208-456c-8e76-c501f93a35f6",
  },
];

const HERO_CARDS = [
  {
    name: "image-gen",
    title: "Сгенерировать\nизображение",
    image:
      "https://www.figma.com/api/mcp/asset/1a8523b1-517a-47a0-885c-7fe186e28134",
    tags: [
      ["Banana Pro", "Flux", "Midjourney"],
      ["GPT Image", "Seedream", "Ideogram"],
    ],
    functional: true,
  },
  {
    name: "video-gen",
    title: "Сгенерировать видео",
    image:
      "https://www.figma.com/api/mcp/asset/da0ddca4-e5e8-4da5-af34-2f8b861ce595",
    tags: [["Kling", "Veo3", "Hailuo", "Sora 2"]],
  },
  {
    name: "train",
    title: "Натренировать\nмодель с помощью\nсвоих фотографий",
    image:
      "https://www.figma.com/api/mcp/asset/c109a711-c9bb-4c49-8181-3ae5fdb5e553",
  },
  {
    name: "process",
    title: "Обработать фото",
    image:
      "https://www.figma.com/api/mcp/asset/3f34d190-2cbc-4edd-aba8-a09515ee021c",
    height: "h-[320px]",
  },
];

const TEMPLATES = [
  {
    label: "Soft Roses",
    url: "https://www.figma.com/api/mcp/asset/00184d55-ef4d-4347-b6b5-4da2dca76179",
  },
  {
    label: "Soft Roses",
    url: "https://www.figma.com/api/mcp/asset/33f3ffed-6163-4e17-ab01-8969a0fe7574",
  },
  {
    label: "Soft Roses",
    url: "https://www.figma.com/api/mcp/asset/18df100c-2048-4cf8-8d6a-71d6c53b2455",
  },
];

interface HomeScreenProps {
  onNavigateToGenerator: () => void;
}

export default function HomeScreen({ onNavigateToGenerator }: HomeScreenProps) {
  const [inputValue, setInputValue] = useState("");
  const [model, setModel] = useState("GPT-5.2");

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending:", inputValue, "with model:", model);
      setInputValue("");
    }
  };

  return (
    <div className="bg-bg-main min-h-screen text-text-light overflow-y-auto">
      {/* Header */}
      <div className="pt-[25px] px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="https://www.figma.com/api/mcp/asset/06d812aa-dd13-48c5-bb03-ebc7d17633bd"
            alt="IMI"
            width={62}
            height={24}
          />
          <div className="bg-blue-accent rounded-[6px] px-[5px] py-[4px] flex items-center gap-[3px]">
            <Image
              src="https://www.figma.com/api/mcp/asset/4cae27e3-917b-4ddf-9d1b-691259db8145"
              alt=""
              width={10}
              height={10}
            />
            <span className="text-white text-[10px] font-norms">Go!</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#e8eaee] rounded-full p-2 flex items-center justify-center">
            <Image
              src="https://www.figma.com/api/mcp/asset/f41e4329-b630-41ba-957f-bcdf48e75d69"
              alt="user"
              width={16}
              height={16}
            />
          </div>
          <div className="bg-[#e8eaee] rounded-full px-3 py-2 flex items-center gap-1 text-black text-[12px] font-norms">
            <span>50</span>
            <Image
              src="https://www.figma.com/api/mcp/asset/c074a7fa-0512-4139-acf4-67b73383172a"
              alt="coins"
              width={12}
              height={12}
            />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center pt-[42px] px-4">
        <h1 className="font-machina font-bold text-[24px] text-white leading-[30px]">
          Чем я могу помочь Вам сегодня?
        </h1>
      </div>

      {/* Input */}
      <div className="mt-[30px] mx-4">
        <Input />
      </div>

      {/* AI Agents Section */}
      <div className="mt-[40px] px-4">
        <h2 className="font-machina font-medium text-[22px] text-white leading-[24.2px] mb-4">
          Умные AI-Агенты
        </h2>
        <div className="flex gap-[12px] overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {AGENTS.map((agent) => (
            <AgentCard
              key={agent.name}
              name={agent.name}
              imageUrl={agent.url}
            />
          ))}
        </div>
      </div>

      {/* Hero Cards */}
      {HERO_CARDS.map((card) => (
        <HeroCard
          key={card.name}
          title={card.title}
          image={card.image}
          tags={card.tags}
          height={card.height}
          functional={card.functional}
          onClick={() => card.functional && onNavigateToGenerator()}
        />
      ))}

      {/* Templates Section */}
      <div className="mt-6 px-4">
        <h2 className="font-machina font-medium text-[26px] text-white mb-4">
          Фото и видео шаблоны
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {TEMPLATES.map((template, idx) => (
            <div
              key={idx}
              className="relative w-[240px] h-[305px] rounded-[16px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={template.url}
                alt={template.label}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 font-machina font-bold text-[20px] text-text-light">
                {template.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Show All Button */}
      <div className="mt-8 mb-12 text-center">
        <motion.button
          className="bg-blue-accent rounded-[10px] h-[48px] px-7 flex items-center gap-1 justify-center mx-auto text-white text-[14px] font-norms"
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="https://www.figma.com/api/mcp/asset/3866ad49-af70-4209-9eff-c5e517203f09"
            alt="icon"
            width={10}
            height={10}
          />
          Показать все
        </motion.button>
      </div>
    </div>
  );
}
