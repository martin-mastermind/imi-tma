import Image from 'next/image';

interface AgentCardProps {
  name: string;
  imageUrl: string;
}

export default function AgentCard({ name, imageUrl }: AgentCardProps) {
  const isMultiLine = name.split(' ').length > 2 || name.includes('-');

  return (
    <div className="relative bg-black border-2 border-black h-[132px] w-[109px] overflow-hidden rounded-[20px] flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity group">
      {/* Gradient overlay (inactive state) */}
      <div className="absolute bg-gradient-to-b from-[#0b3bec] from-[1.33%] inset-0 opacity-0 rounded-[17px] to-black group-hover:opacity-10 transition-opacity" />

      {/* Image */}
      <div className="absolute left-px top-[18px] size-[105px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-[5px] left-0 right-0 rounded-bl-[20px] rounded-br-[20px] bg-gradient-to-t from-black h-[84px] to-[rgba(0,0,0,0)]" />

      {/* Text */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex flex-col font-norms text-[12px] text-[#f5f5f6] text-center leading-[12px] ${
          isMultiLine ? 'top-[100px] h-[26px]' : 'top-[106px] h-[12px]'
        }`}
      >
        {isMultiLine ? (
          name.split(' ').map((word, idx) => (
            <p key={idx} className={idx > 0 ? 'mb-0' : 'mb-0'}>
              {word}
            </p>
          ))
        ) : (
          <p className="leading-[12px]">{name}</p>
        )}
      </div>
    </div>
  );
}
