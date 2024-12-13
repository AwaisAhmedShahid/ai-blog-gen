import { cookieClient } from "@/clients/cookie-client";
import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import Link from "next/link";

export default function Custom404() {
  const reqOrigin = cookieClient().getItem("REQ_ORIGIN");

  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4">
      <div>
        <h1 className="text-4xl font-bold">404</h1>
      </div>
      <div>
        <h2 className="text-2xl">Page not found</h2>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={reqOrigin} className="underline">
          <Button>
            <span className="text-center">Return to last Page</span>
          </Button>
        </Link>
        <Link href={PAGE_ROUTES.LOGIN} className="underline">
          <Button>
            <span className="text-center">GO TO APP LOGIN</span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
