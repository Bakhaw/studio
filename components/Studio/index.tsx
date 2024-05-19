"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { LightbulbIcon, LightbulbOffIcon } from "lucide-react";
import { SlSizeFullscreen } from "react-icons/sl";
import { MdCloseFullscreen } from "react-icons/md";

import { usePlayerStore } from "@/store/usePlayerStore";

import useDominantColor from "@/hooks/useDominantColor";
import useTrack from "@/hooks/useTrack";
import generateRGBString from "@/lib/generateRGBString";

import { Button } from "@/components/ui/button";

import UserNav from "@/components/UserNav";
import Vinyl from "@/components/Vinyl";

const Studio = () => {
  const { status } = useSession();

  const currentPlaybackState = usePlayerStore((s) => s.currentPlaybackState);
  const [useAlbumColor, setUseAlbumColor] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const track = useTrack(currentPlaybackState?.item?.id);
  const dominantColor = useDominantColor(track?.album.images[0].url);
  const backgroundColor = useAlbumColor
    ? generateRGBString(dominantColor)
    : "#000";

  const handleFullscreenToggle = () => {
    const element = document.documentElement;

    const requestFullscreenMethod = element.requestFullscreen;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (requestFullscreenMethod) {
      requestFullscreenMethod.call(element);
      setIsFullScreen(true);
    }
  };

  if (status === "loading") return <div>Loading</div>;

  return (
    <div
      className="flex flex-col items-center h-screen relative"
      style={{
        backgroundColor,
      }}
    >
      <div className="absolute top-0 flex justify-end items-start gap-4 w-full p-4">
        <Button
          className="group border transition-all hover:scale-110"
          onClick={() => setUseAlbumColor((useAlbumColor) => !useAlbumColor)}
          size="icon"
          variant="ghost"
        >
          {useAlbumColor ? (
            <LightbulbIcon className="text-foreground" />
          ) : (
            <LightbulbOffIcon className="text-foreground" />
          )}
        </Button>
        <Button
          className="group border transition-all hover:scale-110"
          onClick={handleFullscreenToggle}
          size="icon"
          variant="ghost"
        >
          {isFullScreen ? (
            <MdCloseFullscreen className="text-foreground" />
          ) : (
            <SlSizeFullscreen className="text-foreground" />
          )}
        </Button>

        <UserNav />
      </div>

      <div className="flex flex-auto items-center justify-center">
        <Vinyl />
      </div>
    </div>
  );
};

export default Studio;
