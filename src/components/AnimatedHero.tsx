
import { MobileHero } from "./hero/MobileHero";
import { DesktopHero } from "./hero/DesktopHero";
import { useRotatingText } from "./hero/useRotatingText";
import { HeroProps } from "./hero/types";

function Hero({ isMobile = false }: HeroProps) {
  const { titleNumber, titles } = useRotatingText();

  if (isMobile) {
    return <MobileHero titles={titles} titleNumber={titleNumber} isMobile={isMobile} />;
  }

  return <DesktopHero titles={titles} titleNumber={titleNumber} isMobile={isMobile} />;
}

export { Hero };
