import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(125,211,252,.18),transparent_45%),radial-gradient(900px_circle_at_90%_20%,rgba(251,146,60,.14),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,.02),rgba(0,0,0,.06))] dark:bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(125,211,252,.10),transparent_45%),radial-gradient(900px_circle_at_90%_20%,rgba(251,146,60,.10),transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,.02),rgba(255,255,255,.03))]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}


