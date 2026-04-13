import Image from "next/image";

export default function Input() {
  return (
    <div className="h-[50px] bg-[#1a1b1c] border border-[rgba(140,141,141,0.2)] rounded-[18px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center pl-5 pr-[7px] gap-2">
      {/* Text Input */}
      <input
        type="text"
        placeholder="Спросите что-нибудь..."
        className="flex-1 bg-transparent text-[#98a2b3] text-[14px] font-norms outline-none placeholder-text-[#98a2b3]"
      />

      {/* Model Selector */}
      <button className="rounded-[8px] flex items-center gap-1 flex-shrink-0">
        <span className="text-white text-[14px] font-norms font-medium whitespace-nowrap">
          GPT-5.2
        </span>
        <Image
          src="/icons/icon-dropdown.svg"
          alt="dropdown"
          width={16}
          height={16}
          className="flex-shrink-0"
        />
      </button>

      {/* Send Button */}
      <button className="bg-white rounded-[12px] size-[36px] flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0">
        <Image src="/icons/icon-send.svg" alt="send" width={20} height={20} />
      </button>
    </div>
  );
}
