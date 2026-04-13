interface SectionHeaderProps {
  title: string;
  showLink?: boolean;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHeader({
  title,
  showLink,
  linkText = "Показать все",
  linkHref = "#",
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-[15px]">
      <h3 className="font-machina text-[20px] text-white pl-[4px]">{title}</h3>
      {showLink && (
        <a
          href={linkHref}
          className="mt-[6px] w-[94px] text-[#0067E7] text-[14px] font-medium leading-[20px] font-inter tracking-[0.46px]"
        >
          {linkText}
        </a>
      )}
    </div>
  );
}
