"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";

import SpotifyIcon from "@/assets/spotify-icon.png";

import useProviders from "@/hooks/useProviders";

const Login = () => {
  const providers = useProviders();

  function handleLoginButtonClick(provider: ClientSafeProvider) {
    signIn(provider.id, {
      callbackUrl: "/",
    });
  }

  if (!providers) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="absolute top-12">
        <Image alt="spotify logo" src={SpotifyIcon} height={40} width={40} />
      </div>

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="text-black bg-green-primary hover:bg-green-primary/90 transition-all w-72 h-12 rounded-3xl"
            onClick={() => handleLoginButtonClick(provider)}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;
