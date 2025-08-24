/**
 * Dynamic OpenGraph Image Generation
 * Creates contextual OG images for different pages and locales
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const source = searchParams.get("source");
    const target = searchParams.get("target");

    // Generate title and subtitle based on context
    let title = "Nonna.fm";
    let subtitle = "Transfer your music between streaming services";

    if (source && target) {
      const serviceNames = {
        spotify: "Spotify",
        apple: "Apple Music",
        youtube: "YouTube Music",
        deezer: "Deezer",
        tidal: "TIDAL",
      };

      const sourceName = serviceNames[source as keyof typeof serviceNames] || source;
      const targetName = serviceNames[target as keyof typeof serviceNames] || target;

      title = `Transfer from ${sourceName} to ${targetName}`;
      subtitle = "Move your playlists, albums, and liked songs seamlessly";
    }

    // Localized subtitles
    const localizedSubtitles: Record<string, string> = {
      en: "Transfer your music between streaming services",
      es: "Transfiere tu música entre servicios de streaming",
      fr: "Transférez votre musique entre services streaming",
      de: "Übertragen Sie Ihre Musik zwischen Streaming-Diensten",
      pt: "Transfira sua música entre serviços de streaming",
      it: "Trasferisci la tua musica tra servizi streaming",
      ja: "ストリーミングサービス間で音楽を転送",
    };

    subtitle = localizedSubtitles[locale] || subtitle;

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
            color: "white",
            padding: "40px",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            🎵 Nonna.fm
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: "48px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "16px",
              lineHeight: 1.1,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: "400",
              textAlign: "center",
              opacity: 0.9,
              maxWidth: "800px",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </div>

          {/* Service Icons (if source/target specified) */}
          {source && target && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "40px",
                gap: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  padding: "20px 30px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {getServiceIcon(source)}
              </div>

              <div style={{ fontSize: "40px" }}>→</div>

              <div
                style={{
                  fontSize: "32px",
                  padding: "20px 30px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {getServiceIcon(target)}
              </div>
            </div>
          )}

          {/* Free Badge */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              backgroundColor: "#10b981",
              color: "white",
              padding: "12px 24px",
              borderRadius: "20px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Free
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

function getServiceIcon(service: string): string {
  const icons: Record<string, string> = {
    spotify: "🎧",
    apple: "🍎",
    youtube: "📺",
    deezer: "🎶",
    tidal: "🌊",
    amazon: "📦",
    pandora: "📻",
  };

  return icons[service] || "🎵";
}
