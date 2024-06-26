import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { FaPause, FaPlay } from "react-icons/fa6";

import { usePlayerStore } from "@/store/usePlayerStore";
import { useTimerStore } from "@/store/useTimerStore";

import useDominantColor from "@/hooks/useDominantColor";
import useSpotify from "@/hooks/useSpotify";
import useTrack from "@/hooks/useTrack";

import generateRGBString from "@/lib/generateRGBString";
import { cn } from "@/lib/utils";

import AlbumLink from "@/components/AlbumLink";
import ArtistLink from "@/components/ArtistLink";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";

import CoverFallback from "../../assets/cover-fallback.svg";

import vinylColors from "./vinylColors";

const Vinyl = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const {
    currentPlaybackState,
    fetchPlaybackState,
    fetchQueue,
    setCurrentPlaybackState,
  } = usePlayerStore();
  const setProgressMs = useTimerStore((s) => s.setProgressMs);
  const track = useTrack(currentPlaybackState?.item?.id);

  // initialize playback state
  useEffect(() => {
    if (!spotifyApi.getAccessToken()) return;

    // if the store already contain a playback state, just use it -> no need to fetch
    // if the store is empty, we need to fetch
    if (!currentPlaybackState) {
      fetchPlaybackState();
    }
  }, [currentPlaybackState, spotifyApi, session, fetchPlaybackState]);

  // this value is corresponding to .album-box .active .vinyl animation-delay property
  const activeVinylAnimationDelayProperty = 2600;

  // todo handle prev with queue
  async function onPreviousButtonClick() {
    await spotifyApi.skipToPrevious();

    // set timeout is used to make sure the previous song has finished fetching
    setTimeout(async () => {
      await fetchPlaybackState();
    }, activeVinylAnimationDelayProperty);
  }

  async function onNextButtonClick() {
    const queue = await fetchQueue();
    const nextTrack = queue?.queue[0];

    if (!nextTrack || !currentPlaybackState) return;

    setCurrentPlaybackState({
      ...currentPlaybackState,
      is_playing: false,
    });

    spotifyApi.pause();

    setTimeout(async () => {
      setCurrentPlaybackState({
        ...currentPlaybackState,
        item: {
          ...nextTrack,
        },
        is_playing: true,
        progress_ms: 0,
      });

      setProgressMs(0);

      await spotifyApi.skipToNext();
    }, activeVinylAnimationDelayProperty);
  }

  async function togglePlay() {
    if (!currentPlaybackState) return;

    if (currentPlaybackState?.is_playing) {
      spotifyApi.pause();

      setTimeout(async () => {
        await fetchPlaybackState();
      }, 500);
    } else {
      setCurrentPlaybackState({
        ...currentPlaybackState,
        is_playing: true,
      });

      setTimeout(() => {
        spotifyApi.play();
      }, activeVinylAnimationDelayProperty);
    }
  }

  const filteredVinyls = vinylColors.filter(
    (vinyl) => vinyl.albumId === track?.album.id
  );

  const dominantColor = useDominantColor(track?.album.images[0].url);
  const rgb = generateRGBString(dominantColor);

  const vinylColor = (fallbackColor: string) =>
    filteredVinyls.length > 0
      ? filteredVinyls[0].backgroundColor
      : fallbackColor;

  const trackImage = track?.album.images[0];

  return (
    <div className="music-box">
      <div
        id="album"
        className={cn(
          "album-box",
          currentPlaybackState?.is_playing && "active"
        )}
      >
        <>
          <div className="album-cover hover:scale-110">
            <Image
              alt={`${track?.name} cover`}
              height={trackImage?.height ?? 300}
              width={trackImage?.width ?? 300}
              onClick={togglePlay}
              role="button"
              src={trackImage?.url ?? CoverFallback}
            />
            {track && (
              <div className="absolute bottom-[-100px] left-0">
                <AlbumLink className="text-4xl" albumId={track.album.id}>
                  {track.name}
                </AlbumLink>
                <ArtistLink className="text-3xl" artists={track.artists} />
              </div>
            )}
          </div>

          <div
            className="album-inside"
            style={{
              background: vinylColor(rgb),
              boxShadow: `10px 0 15px 0 ${vinylColor("#000000")}60`,
              WebkitBoxShadow: `10px 0 15px 0 ${vinylColor("#000000")}60`,
            }}
          ></div>

          <div
            className="vinyl"
            onClick={togglePlay}
            style={{
              background: vinylColor(rgb),
            }}
          >
            {[...Array(32)].map((_, index) => (
              <div key={index} className={`spire spire-${index}`}></div>
            ))}
            <div
              className="vinyl-face"
              style={{
                backgroundImage: `url(${String(trackImage?.url)})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div
              className="vinyl-center"
              style={{
                background: vinylColor("#ffffff"),
              }}
            ></div>
          </div>
          <div id="turntable">
            <svg
              className="turntable-arm"
              viewBox="0 0 211 246"
              xmlSpace="preserve"
            >
              <g>
                <polygon
                  id="bar"
                  points="161.5,226.375 189.625,245.625 192.625,242.125 164.125,222.75 	"
                />
                <path
                  className="darken-grey"
                  d="M189.087,243.743c0,0,2.522-3.493,3.03-3.118s0.508,1.5,0.508,1.5l-3,3.5L189.087,243.743z"
                />
                <path
                  className="darken-grey"
                  d="M191.167,182.667c0.5,3-31.833,50.333-35,50.5s-15.5-8.333-15.5-11.666s23.647-52.17,26.98-52.336
        c0,0,2.353-0.79,6.583,1.557C177.536,172.556,190.872,180.9,191.167,182.667z"
                />
                <path
                  className="grey"
                  d="M191.167,182.667c0.5,3-31.833,52.333-35,52.5S139,226.667,139,223.334s27.334-54.001,30.667-54.167
        S190.667,179.667,191.167,182.667z"
                />
                <path
                  className="grey"
                  d="M187.334,0c-0.605,5.307-1.125,10.628-1.492,15.956c-0.27,3.924-0.477,7.765,0.198,11.644
        c1.743,10.023,3.608,20.025,5.376,30.045c2.456,13.916,4.861,27.846,6.934,41.825c0.812,5.479,1.591,10.968,2.139,16.479
        c0.377,3.79,0.686,7.439-0.204,11.18c-2.056,8.648-6.675,16.742-11.152,24.339c-1.223,2.074-2.375,4.289-3.796,6.237
        c-1.368,1.877-2.737,3.755-4.106,5.632c-2.508,3.44-5.017,6.88-7.524,10.32c-0.118,0.162,7.455,6.027,8.295,6.696
        c6.419-8.728,12.442-17.812,17.894-27.172c3.604-6.189,7.216-12.652,9.306-19.538c1.693-5.581,1.412-11.596,1.081-17.351
        c-0.896-15.565-3.46-31.051-6.053-46.408c-0.873-5.172-1.619-10.397-2.701-15.529c-1.098-5.205-2.402-10.362-3.386-15.591
        c-1.146-6.097-1.836-12.236-1.84-18.444c-0.003-6.737,0.383-13.753,2.033-20.32C194.667,0,191.001,0,187.334,0z"
                />
                <g>
                  <path
                    className="darken-grey"
                    d="M193.933,159.342l0.883,0.616c1.76,1.242,1.628,1.47,1.628,1.47l-8.454,14.72c0,0-0.198,0.345-2.181-0.508
          l-0.979-0.447c-0.95-0.498-0.966-0.47-1.901-0.992l-0.934-0.527c-0.93-0.534-0.946-0.549-1.388-0.812
          c-0.442-0.262-0.454-0.283-1.378-0.828l-0.91-0.568c-0.912-0.564-0.891-0.602-1.795-1.177l-0.822-0.72l-0.056,0.096
          c-1.739-1.276-1.146-1.58-1.146-1.58l8.5-14.545l1.448,0.798l0.929,0.533c0,0,1.159,0.135,2.1,0.649l0.941,0.514
          c0.933,0.528,0.952,0.537,1.398,0.794L193.933,159.342z"
                  />
                  <line
                    className="darken-grey"
                    x1="192.417"
                    y1="157.677"
                    x2="191.488"
                    y2="157.143"
                  />
                </g>
                <g>
                  <path
                    className="grey"
                    d="M183.502,152.42l-8.454,14.72c0,0-0.142,0.247,1.598,1.523l8.946-15.577
          C183.633,152.191,183.502,152.42,183.502,152.42z"
                  />
                  <path
                    className="grey"
                    d="M186.568,153.538l-9.046,15.749c0.906,0.575,0.884,0.612,1.797,1.178l9.157-15.946
          C187.536,154.004,187.518,154.035,186.568,153.538z"
                  />
                  <path
                    className="grey"
                    d="M193.124,157.188l-9.196,16.013c0.936,0.522,0.951,0.494,1.902,0.992l9.103-15.851
          C194.024,157.771,194.042,157.741,193.124,157.188z"
                  />
                  <path
                    className="grey"
                    d="M195.815,158.958l-9.007,15.682c1.982,0.853,2.181,0.508,2.181,0.508l8.454-14.72
          C197.443,160.428,197.575,160.2,195.815,158.958z"
                  />
                  <path
                    className="grey"
                    d="M190.816,155.826c-0.446-0.257-0.466-0.266-1.398-0.794l-9.189,16c0.924,0.545,0.936,0.566,1.378,0.828
          c0.441,0.264,0.458,0.278,1.388,0.812l9.212-16.039C191.28,156.095,191.264,156.081,190.816,155.826z"
                  />
                  <polygon
                    className="darken-grey"
                    points="185.447,153.336 176.7,168.566 177.425,169.459 186.377,153.869"
                  />
                  <polygon
                    className="darken-grey"
                    points="188.477,154.519 179.161,170.738 180.091,171.272 189.897,155.304"
                  />
                  <polygon
                    className="darken-grey"
                    points="192.206,156.634 182.879,172.874 183.809,173.407 193.124,157.188"
                  />
                  <polygon
                    className="darken-grey"
                    points="194.933,158.342 185.83,174.192 186.809,174.64 195.672,159.208"
                  />
                </g>
              </g>
            </svg>

            <div className="flex justify-between items-center w-full gap-2 absolute bottom-0 p-2">
              <div className="flex justify-between items-start gap-1">
                <Button size="sm" onClick={onPreviousButtonClick}>
                  <IoPlaySkipBack />
                </Button>

                <Button size="sm" onClick={onNextButtonClick}>
                  <IoPlaySkipForward />
                </Button>
              </div>

              <div className="w-full text-sm">
                <Timer />
              </div>

              <div className="flex justify-end ">
                {currentPlaybackState?.is_playing ? (
                  <Button size="sm" onClick={togglePlay}>
                    <FaPause />
                  </Button>
                ) : (
                  <Button size="sm" onClick={togglePlay}>
                    <FaPlay />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default Vinyl;
