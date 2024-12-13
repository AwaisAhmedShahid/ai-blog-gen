import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"relative min-h-screen  flex flex-col justify-between"}>
      <div className={"flex-1"}>
        <Header />
        <main className={"md:mb-12 mb-8 min-w-full prose md:prose-lg dark:prose-invert container px-0"}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
