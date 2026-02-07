import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    id: 1,
    author_name: "Kouamé Yao",
    author_avatar: "",
    rating: 5,
    comment: "Service de rédaction excellent ! Mon mémoire a été livré dans les délais avec une qualité exceptionnelle. Je recommande vivement.",
    service: "Rédaction Académique",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    author_name: "Fatou Diallo",
    author_avatar: "",
    rating: 5,
    comment: "Grâce à leur accompagnement, j'ai obtenu mon visa de travail pour le Canada en seulement 3 semaines. Merci infiniment !",
    service: "Assistance Voyage",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    author_name: "Jean-Baptiste Konan",
    author_avatar: "",
    rating: 4,
    comment: "Mon CV et ma lettre de motivation ont été refaits de manière professionnelle. J'ai décroché un entretien dès la première candidature.",
    service: "CV & Lettre de Motivation",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 4,
    author_name: "Marie Adjoua",
    author_avatar: "",
    rating: 5,
    comment: "La création de mon site e-commerce a été un vrai succès. L'équipe est réactive et professionnelle.",
    service: "Création Site Web",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 5,
    author_name: "Amadou Traoré",
    author_avatar: "",
    rating: 5,
    comment: "Formation en développement web très complète. Les formateurs sont compétents et patients.",
    service: "Formation Pratique",
    gradient: "from-teal-500 to-cyan-600",
  },
];

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <Star className="h-3 w-3 mr-2 fill-yellow-400 text-yellow-400" />
            Témoignages clients
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ce que disent nos <span className="gradient-text">clients</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui nous font confiance pour leurs projets.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex bg-background shadow-lg hover:shadow-xl transition-all"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex bg-background shadow-lg hover:shadow-xl transition-all"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Carousel */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                >
                  <Card className={`h-full transition-all duration-500 hover:shadow-xl ${
                    index === selectedIndex ? "scale-100 shadow-lg" : "scale-95 opacity-80"
                  }`}>
                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Quote icon */}
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${testimonial.gradient} text-white mb-4`}>
                        <Quote className="h-5 w-5" />
                      </div>
                      
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-all ${
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-muted-foreground mb-6 flex-1 line-clamp-4 italic">
                        "{testimonial.comment}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary/20">
                          <AvatarImage src={testimonial.author_avatar} />
                          <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white font-semibold`}>
                            {testimonial.author_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.author_name}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {testimonial.service}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
