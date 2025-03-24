import Image from "next/image";

interface ArtworkImageProps {
  src: string;
  alt: string;
  size: number;
  className?: string;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({ src, alt, size, className = "" }) => {
  return (
    <div style={{ width: size, height: size }} className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} />
    </div>
  );
};
