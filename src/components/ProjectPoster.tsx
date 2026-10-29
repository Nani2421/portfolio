import Image from "next/image";

/**
 * A project's poster in the current mode: public/projects/<slug>-light.jpg, or
 * <slug>-dark.jpg in dark mode. Both are in the page and CSS shows one, so a
 * toggle swaps them instantly.
 */
export default function ProjectPoster({
  slug,
  title,
  sizes,
  priority = false,
  className = "",
}: {
  slug: string;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const alt = `${title} poster`;
  const common = { width: 1200, height: 900, sizes, priority };
  return (
    <>
      <Image {...common} alt={alt} src={`/projects/${slug}-light.jpg`} className={`h-auto w-full dark:hidden ${className}`} />
      <Image {...common} alt={alt} src={`/projects/${slug}-dark.jpg`} className={`hidden h-auto w-full dark:block ${className}`} />
    </>
  );
}
