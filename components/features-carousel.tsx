"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Brain, Shield, Zap, Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: (
      <Brain className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-primary" />
    ),
    title: "AI-Powered Memory",
    description:
      "Store and understand your memories from images, videos, text, notes, and voice records with advanced AI",
  },
  {
    icon: (
      <Shield className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-secondary" />
    ),
    title: "End-to-End Encryption",
    description:
      "Your privacy matters. Complete end-to-end encryption with the option to permanently delete your data from our servers",
  },
  {
    icon: (
      <Zap className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-warning" />
    ),
    title: "Lightning Fast",
    description:
      "Experience blazing-fast performance that outpaces other memory apps. Your memories, instantly accessible",
  },
  {
    icon: (
      <Sparkles className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 text-success" />
    ),
    title: "Why Memorly?",
    description:
      "The perfect blend of AI intelligence, security, and speed. Your memories deserve the best protection and accessibility",
  },
];

export const FeaturesCarousel = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Swiper
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
        }}
        className="features-swiper !py-20"
        loop={true}
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
      >
        {features.map((feature, index) => {
          const glowClasses = [
            "icon-glow-primary",
            "icon-glow-secondary",
            "icon-glow-warning",
            "icon-glow-success",
          ];

          const titleColors = [
            "text-primary",
            "text-secondary",
            "text-warning",
            "text-success",
          ];

          const renderDescription = (idx: number) => {
            if (idx === 0) {
              // AI-Powered Memory
              return (
                <>
                  Store and understand your memories from{" "}
                  <span className="font-bold text-success ">
                    images, videos, text, notes, and voice records
                  </span>{" "}
                  with advanced{" "}
                  <span className="font-bold text-primary ">AI</span>
                </>
              );
            } else if (idx === 1) {
              // End-to-End Encryption
              return (
                <>
                  Your privacy matters.{" "}
                  <span className="font-bold text-success ">
                    Complete end-to-end encryption
                  </span>{" "}
                  with the option to{" "}
                  <span className="font-bold text-danger ">
                    permanently delete
                  </span>{" "}
                  your data from our servers
                </>
              );
            } else if (idx === 2) {
              // Lightning Fast
              return (
                <>
                  Experience{" "}
                  <span className="font-bold text-warning ">
                    blazing-fast performance
                  </span>{" "}
                  that outpaces other memory apps. Your memories,{" "}
                  <span className="font-bold text-success ">
                    instantly accessible
                  </span>
                </>
              );
            } else {
              // Why Memorly?
              return (
                <>
                  The perfect blend of{" "}
                  <span className="font-bold text-primary ">
                    AI intelligence
                  </span>
                  , <span className="font-bold text-success ">security</span>,
                  and <span className="font-bold text-warning ">speed</span>.
                  Your memories deserve the best protection and accessibility
                </>
              );
            }
          };

          return (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center text-center p-4 md:p-6 lg:p-8 rounded-lg transition-transform hover:scale-105">
                <div className={`mb-6 md:mb-8 lg:mb-10 ${glowClasses[index]}`}>
                  {feature.icon}
                </div>
                <h3
                  className={`text-2xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 lg:mb-6 ${titleColors[index]}`}
                >
                  {feature.title}
                </h3>
                <p className=" text-base md:text-base lg:text-lg text-default-600 leading-relaxed">
                  {renderDescription(index)}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
