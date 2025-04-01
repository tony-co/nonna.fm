"use client";

import { createContext, useContext, ReactNode, FC, useState } from "react";

export interface MatchingState {
  tracks: Map<string, { status: "pending" | "matched" | "unmatched"; targetId?: string }>;
  albums: Map<string, { status: "pending" | "matched" | "unmatched"; targetId?: string }>;
}

interface MatchingContextType {
  matchingState: MatchingState;
  setTrackStatus: (
    trackId: string,
    status: "pending" | "matched" | "unmatched",
    targetId?: string
  ) => void;
  setAlbumStatus: (
    albumId: string,
    status: "pending" | "matched" | "unmatched",
    targetId?: string
  ) => void;
  getTrackStatus: (trackId: string) => "pending" | "matched" | "unmatched" | undefined;
  getTrackTargetId: (trackId: string) => string | undefined;
  getAlbumStatus: (albumId: string) => "pending" | "matched" | "unmatched" | undefined;
  getAlbumTargetId: (albumId: string) => string | undefined;
}

const MatchingContext = createContext<MatchingContextType | null>(null);

export const useMatching = (): MatchingContextType => {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error("useMatching must be used within a MatchingProvider");
  }
  return context;
};

interface MatchingProviderProps {
  children: ReactNode;
  initialState?: MatchingState;
}

export const MatchingProvider: FC<MatchingProviderProps> = ({ children, initialState }) => {
  const [matchingState, setMatchingState] = useState<MatchingState>(
    initialState || {
      tracks: new Map(),
      albums: new Map(),
    }
  );

  const setTrackStatus = (
    trackId: string,
    status: "pending" | "matched" | "unmatched",
    targetId?: string
  ): void => {
    setMatchingState(prev => ({
      ...prev,
      tracks: new Map(prev.tracks).set(trackId, { status, targetId }),
    }));
  };

  const setAlbumStatus = (
    albumId: string,
    status: "pending" | "matched" | "unmatched",
    targetId?: string
  ): void => {
    setMatchingState(prev => ({
      ...prev,
      albums: new Map(prev.albums).set(albumId, { status, targetId }),
    }));
  };

  const getTrackStatus = (trackId: string): "pending" | "matched" | "unmatched" | undefined => {
    return matchingState.tracks.get(trackId)?.status;
  };

  const getTrackTargetId = (trackId: string): string | undefined => {
    return matchingState.tracks.get(trackId)?.targetId;
  };

  const getAlbumStatus = (albumId: string): "pending" | "matched" | "unmatched" | undefined => {
    return matchingState.albums.get(albumId)?.status;
  };

  const getAlbumTargetId = (albumId: string): string | undefined => {
    return matchingState.albums.get(albumId)?.targetId;
  };

  return (
    <MatchingContext.Provider
      value={{
        matchingState,
        setTrackStatus,
        setAlbumStatus,
        getTrackStatus,
        getTrackTargetId,
        getAlbumStatus,
        getAlbumTargetId,
      }}
    >
      {children}
    </MatchingContext.Provider>
  );
};
