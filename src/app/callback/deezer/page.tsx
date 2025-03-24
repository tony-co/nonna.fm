import { handleDeezerCallback } from "@/lib/services/deezer/auth";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DeezerCallback({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const { success, role } = await handleDeezerCallback(searchString);

  if (!success) {
    console.error("Failed to handle Deezer callback");
    redirect("/");
  }

  // Redirect based on role
  if (role === "target") {
    redirect("/transfer");
  }

  redirect("/source");
}
