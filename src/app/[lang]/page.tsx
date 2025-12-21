import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import { Locale } from "../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const carouselImages = PlaceHolderImages.filter(p => p.id.startsWith("carousel-"));
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
          src={carouselImages[0]?.imageUrl || "https://picsum.photos/seed/bakery-hero/1920/1080"}
          alt={carouselImages[0]?.description || "Hero image of a baked good"}
          fill
          className="object-cover brightness-50"
          data-ai-hint={carouselImages[0]?.imageHint || "bakery interior"}
          priority
        />
        <div className="relative z-10 p-4 space-y-6">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-shadow-lg">
            {dictionary.home.hero.title}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
            {dictionary.home.hero.subtitle}
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/${lang}/order`}>
              <ShoppingBasket className="mr-2 h-5 w-5" />
              {dictionary.home.hero.cta}
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">{dictionary.home.creations.title}</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {dictionary.home.creations.subtitle}
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {carouselImages.map((img, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden rounded-lg">
                        <Image
                          src={img.imageUrl}
                          alt={img.description}
                          width={600}
                          height={600}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          data-ai-hint={img.imageHint}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
