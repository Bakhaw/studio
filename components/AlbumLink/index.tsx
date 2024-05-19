import Link from "next/link";

import { cn } from "@/lib/utils";

interface AlbumLinkProps {
  albumId: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const AlbumLink: React.FC<AlbumLinkProps> = ({
  albumId,
  children,
  className,
  isActive,
  onClick,
}) => {
  return (
    <div className="box-border min-w-0">
      <Link
        className={cn(
          "block truncate text-left text-sm hover:underline",
          isActive && "text-green-primary",
          className
        )}
        href={`https://open.spotify.com/album/${albumId}`}
        target="_blank"
        onClick={onClick}
      >
        {children}
      </Link>
    </div>
  );
};

export default AlbumLink;
