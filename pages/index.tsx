import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { FeaturesCarousel } from "@/components/features-carousel";

export default function IndexPage() {
  return (
    <section className="relative flex flex-col items-center justify-between h-full gap-4 py-0 md:py-10 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background pointer-events-none" />

      <div className="relative z-10 w-full [&_.swiper-pagination]:!fixed mt-auto">
        <FeaturesCarousel />
      </div>

      <div className="relative z-10 flex flex-col gap-4 mb-10 w-full mt-auto">
        <Button
          as={Link}
          className="font-semibold"
          color="primary"
          href="/login"
          size="lg"
          variant="shadow"
        >
          Login
        </Button>
        <Button
          as={Link}
          className="font-semibold"
          href="/register"
          size="lg"
          variant="bordered"
        >
          Register
        </Button>
      </div>
    </section>
  );
}
