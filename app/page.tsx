import { Button, Card, CardBody } from "@heroui/react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to Media Auto Demo
        </h1>
        <Card className="max-w-md">
          <CardBody>
            <p className="text-center sm:text-left text-sm">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                app/page.tsx
              </code>
            </p>
            <p className="text-sm text-default-500 mt-2">
              This project is now powered by HeroUI components!
            </p>
          </CardBody>
        </Card>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            as="a"
            color="primary"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </Button>
          <Button
            as="a"
            variant="bordered"
            color="primary"
            href="https://heroui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            HeroUI Docs
          </Button>
        </div>
      </main>
    </div>
  );
}
