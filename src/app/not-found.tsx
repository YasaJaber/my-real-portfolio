import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[80dvh] place-items-center px-6">
      <div className="text-center">
        <h1 className="font-display text-[clamp(6rem,18vw,14rem)] font-extrabold leading-none gradient-text">
          404
        </h1>
        <p className="mt-2 text-lg text-white/70">
          This page drifted off the mesh.
        </p>
        <Link
          href="/"
          className="btn-ghost mt-8 inline-flex"
          data-cursor-grow
        >
          <ArrowLeft size={16} />
          <span>Back home</span>
        </Link>
      </div>
    </div>
  );
}
