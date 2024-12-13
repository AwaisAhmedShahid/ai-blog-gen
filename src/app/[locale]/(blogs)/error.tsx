"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4">
      <div>
        <h1 className="text-4xl font-bold">500</h1>
      </div>
      <div>
        <h2 className="text-2xl"> Error</h2>
      </div>
      <div>
        <Button onClick={() => router.back()}>
          <span className="text-center">Home</span>
        </Button>
      </div>
    </section>
  );
}
