"use client";
import { motion } from "framer-motion";
import memojiImage from "@/assets/images/memoji-computer.webp";
import grainImage from "@/assets/images/grain.webp";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import StarIcon from "@/assets/icons/star.svg";
import SparkleIcon from "@/assets/icons/sparkle.svg";
import Image from "next/image";
import { HeroOrbit } from "@/components/HeroOrbit";
const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
};

export const HeroSection = () => {
  const ConnectClick = () => {
    const number = "+212665830816";
    window.open(`https://wa.me/${number}`, "_blank");
  };
  const scrollIntoView = () => {
    const projectsSection = document.getElementById("project");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip"
      id="home"
    >
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
        <div
          className="absolute inset-0 -z-30 opacity-5"
          style={{
            backgroundImage: `url(${grainImage.src})`,
          }}
        ></div>
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>
        <HeroOrbit
          size={430}
          rotation={-14}
          shouldOrbit
          orbitDuration="30s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcon className="size-8 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={440}
          rotation={79}
          shouldOrbit
          orbitDuration="32s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcon className="size-5 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={520} rotation={-40} shouldOrbit orbitDuration="34s">
          <div className="size-2 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={530}
          rotation={178}
          shouldOrbit
          orbitDuration="36s"
          shouldSpin
          spinDuration="1s"
        >
          <SparkleIcon className="size-10 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={550}
          rotation={20}
          shouldOrbit
          orbitDuration="38s"
          shouldSpin
          spinDuration="10s"
        >
          <StarIcon className="size-12 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit
          size={590}
          rotation={100}
          shouldOrbit
          orbitDuration="40s"
          shouldSpin
          spinDuration="10s"
        >
          <StarIcon className="size-8 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5} shouldOrbit orbitDuration="42s">
          <div className="size-3 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={710}
          rotation={145}
          shouldOrbit
          orbitDuration="44s"
          shouldSpin
          spinDuration="1s"
        >
          <SparkleIcon className="size-14 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={90} shouldOrbit orbitDuration="46s">
          <div className="size-3 rounded-full bg-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit
          size={800}
          rotation={-72}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="10s"
        >
          <StarIcon className="size-28 text-emerald-300" />
        </HeroOrbit>
      </div>
      <div className="container">
        <div className="flex flex-col items-center">
          <Image
            // src={memojiImage}
            src="/abdo raq.png"
            className="size-[150px] rounded-full"
            alt="person peeking form behind laptop"
          />
          <div className="bg-gray-950 border border-gray-800 py-1.5 px-4 inline-flex items-center gap-4 rounded-lg">
            <div className="bg-green-500 size-2.5 rounded-full relative">
              <div className="bg-green-500 absolute inset-0 rounded-full animate-ping-large"></div>
            </div>
            <div className="text-sm font-medium">
              Available for new projects
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-center mt-8 tracking-wide">
            Crafting Meaningful Digital Experiences
          </h1>
          <p className="mt-4 text-center text-white/60 md:text-lg">
            I&apos;m an independent full-stack web developer, focused on
            building seamless user experiences.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <motion.button
            className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl z-10"
            onClick={scrollIntoView}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <span className="font-semibold">Explore My Work</span>
            <ArrowDown className="size-4" />
          </motion.button>

          <motion.button
            onClick={ConnectClick}
            className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 px-6 h-12 rounded-xl z-10"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <span>👋🏻</span>
            <span className="font-semibold">Let&apos;s Connect</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
