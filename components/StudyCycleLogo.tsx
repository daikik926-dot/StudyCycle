import Image from "next/image";

type StudyCycleLogoProps = {
  size?: number;
  className?: string;
};

export function StudyCycleLogo({
  size = 40,
  className = "",
}: StudyCycleLogoProps) {
  return (
    <Image
      src="/studycycle-icon.svg"
      alt="StudyCycle"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
