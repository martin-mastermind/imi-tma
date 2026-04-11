import Image from "next/image";

const sendIconSvg =
  "https://www.figma.com/api/mcp/asset/b27aadd0-4d2c-43df-8ef9-792c1464501a";
const dropdownIconSvg =
  "https://www.figma.com/api/mcp/asset/3be68d28-62c2-42ca-9dec-5156ff4a1f01";

export default function Input() {
  return (
    <div
      className="bg-[#1a1b1c] border border-[rgba(140,141,141,0.2)] border-solid rounded-[18px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-[48px] flex items-center pl-5 pr-2 gap-2"
      data-node-id="0:15"
      data-name="Input"
    >
      {/* Text Input */}
      <input
        type="text"
        placeholder="Спросите что-нибудь..."
        className="flex-1 bg-transparent text-[#98a2b3] text-[14px] font-norms outline-none placeholder-text-[#98a2b3]"
      />

      {/* Model Selector Button */}
      <button
        className="h-[28px] rounded-[8px] px-2 flex items-center gap-1 hover:bg-[rgba(255,255,255,0.1)] transition-colors flex-shrink-0"
        data-node-id="0:21"
        data-name="Button listbox"
      >
        <span className="font-['TT_Norms:Medium',sans-serif] text-[#f5f5f6] text-[14px] whitespace-nowrap">
          GPT-5.2
        </span>
        <Image
          alt="dropdown"
          src={dropdownIconSvg}
          width={16}
          height={16}
          className="w-4 h-4 flex-shrink-0"
        />
      </button>

      {/* Send Button */}
      <button
        className="bg-white rounded-[12px] size-[36px] flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
        data-node-id="0:18"
        data-name="Button"
      >
        <Image
          alt="send"
          src={sendIconSvg}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
