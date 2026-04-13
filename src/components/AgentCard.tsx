import Image from "next/image";

interface AgentCardProps {
  name: string;
  imageUrl: string;
}

export default function AgentCard({ name, imageUrl }: AgentCardProps) {
  return (
    <button
      type="button"
      className="relative bg-black border-2 border-black h-[132px] w-[109px] overflow-hidden rounded-[20px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity group text-left p-0 appearance-none"
    >
      <div className="absolute bg-gradient-to-b from-[#0b3bec] from-[1.33%] inset-0 opacity-0 rounded-[17px] to-black group-hover:opacity-10 transition-opacity pointer-events-none" />

      <div className="absolute left-px top-[18px] size-[105px] pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
      </div>

      <div className="absolute bottom-[5px] left-0 right-0 rounded-bl-[20px] rounded-br-[20px] bg-gradient-to-t from-black h-[84px] to-[rgba(0,0,0,0)] pointer-events-none" />

      <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 font-norms text-[12px] text-[#f5f5f6] font-medium whitespace-nowrap text-center leading-[12px] pointer-events-none">
        {name}
      </div>
    </button>
  );
}
