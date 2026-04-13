"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import AgentCard from "./AgentCard";
import Input from "./Input";
import HeroCard from "./HeroCard";
import { AGENTS, HERO_CARDS, HOME_TEMPLATES } from "@/constants";

interface HomeScreenProps {
  onNavigateToGenerator: () => void;
}

export default function HomeScreen({ onNavigateToGenerator }: HomeScreenProps) {
  return (
    <div className="bg-bg-main min-h-screen text-text-light overflow-y-auto">
      <div className="pl-[25px] pr-[16px] flex justify-between items-center">
        <div className="flex mt-[16px] items-center gap-3">
          <Image src="/images/logo-imi.svg" alt="IMI" width={62} height={24} />
          <div className="bg-blue-accent w-[46px] h-[22px] px-[7px] rounded-[6px] flex items-center gap-[4px]">
            <Image
              src="/icons/icon-circle-dot.svg"
              alt=""
              width={9}
              height={9}
            />
            <span className="text-white text-[10px] font-norms">Go!</span>
          </div>
        </div>
        <div className="flex mt-[21px] items-center gap-[6px]">
          <div className="bg-white w-[36px] h-[36px] border border-solid border-[#E8EAEE] rounded-full flex items-center justify-center">
            <Image
              src="/icons/icon-user.svg"
              alt="user"
              width={16}
              height={16}
            />
          </div>
          <div className="bg-white w-[66px] h-[34px] border border-solid border-[#E8EAEE] rounded-full items-center justify-center flex gap-[6px]">
            <span className="text-[14px] text-black leading-[20px] font-machina font-bold">
              50
            </span>
            <Image
              src="/icons/icon-coins.svg"
              alt="coins"
              width={12}
              height={12}
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-[24px] w-[265px] mx-auto">
        <h1 className="font-machina font-bold text-[24px] text-white leading-[30px]">
          Чем я могу помочь Вам сегодня?
        </h1>
      </div>

      <div className="mt-[25px] mx-4">
        <Input />
      </div>

      <div className="mt-[28px] px-[21px]">
        <h2 className="font-machina font-medium text-[22px] text-white leading-[24.2px] mb-[12px] px-[5px]">
          Умные AI-Агенты
        </h2>
        <div className="flex gap-[8px] overflow-x-auto -mx-2 px-2 scrollbar-hide">
          {AGENTS.map((agent) => (
            <AgentCard
              key={agent.name}
              name={agent.name}
              imageUrl={agent.url}
            />
          ))}
        </div>
      </div>

      <div className="mt-[19px] px-[15px] flex flex-col gap-[16px]">
        {HERO_CARDS.map((card) => (
          <HeroCard
            key={card.name}
            title={card.title}
            image={card.image}
            tags={card.tags}
            height={card.height}
            bottom={card.bottom}
            functional={card.functional}
            onClick={() => card.functional && onNavigateToGenerator()}
          />
        ))}
      </div>

      <div className="mt-[31px] px-[18px] flex flex-col gap-[10px]">
        <h2 className="w-[241px] px-[4px] font-machina font-medium text-[26px] leading-[28px] text-white mb-4">
          Фото и видео шаблоны
        </h2>
        <div className="flex gap-[22px] overflow-x-auto -mx-4 px-4">
          {HOME_TEMPLATES.map((template, idx) => (
            <div
              key={idx}
              className="relative w-[222px] h-[305px] rounded-[16px] overflow-hidden flex-shrink-0"
            >
              <Image
                src={template.url}
                alt={template.label}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="w-[60px] absolute bottom-[18px] left-[13px] font-machina font-bold text-[20px] leading-[24px] text-text-light">
                {template.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[47px] text-center">
        <motion.button
          className="bg-blue-accent w-[157px] rounded-[10px] h-[48px] flex items-center mx-auto text-white text-[14px] font-norms leading-[24px] tracking-[-0.4px]"
          whileTap={{ scale: 0.95 }}
        >
          <Image
            className="ml-[26px] mr-[8px]"
            src="/icons/icon-show-all.svg"
            alt="icon"
            width={11}
            height={11}
          />
          Показать все
        </motion.button>
      </div>
    </div>
  );
}
