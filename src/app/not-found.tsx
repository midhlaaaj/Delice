import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <section className="w-full pt-32 pb-24 max-w-[1160px] mx-auto px-6 flex flex-col items-center text-center min-h-[70vh] justify-center">
        <span className="font-display text-[96px] sm:text-[140px] leading-none text-ac-maroon">
          404
        </span>
        <h1 className="mt-4 font-editorial text-ac-primary text-[clamp(24px,3.5vw,34px)]">
          This slice wandered off
        </h1>
        <p className="mt-3 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface-variant max-w-md">
          We couldn&apos;t find the page you were looking for. It may have been moved, or the link might be off by a crumb.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="solid">
            Back to home
          </Button>
          <Button href="/explore" variant="outline">
            Explore flavors
          </Button>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
