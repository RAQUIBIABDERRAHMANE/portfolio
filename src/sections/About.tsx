"use client";
import { HeaderSection } from "@/components/HeaderSection";
import BookImage from "@/assets/images/book-cover.webp";
import MapImage from "@/assets/images/map.webp";
import Image from "next/image";
import GitHubIcon from "@/assets/icons/github.svg";
import ReactIcon from "@/assets/icons/react.svg";
import CssIcon from "@/assets/icons/css3.svg";
import HtmlIcon from "@/assets/icons/html5.svg";
import LaravelIcon from "@/assets/icons/laravel.svg";
import JsIcon from "@/assets/icons/square-js.svg";
import DockerIcon from "@/assets/icons/docker.svg";
import PHPIcon from "@/assets/icons/php.svg";
import NodeJsIcon from "@/assets/icons/node-js.svg";
import SmileMemoji from "@/assets/images/memoji-smile.webp";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import { ToolBoxItems } from "@/components/ToolBoxItems";
import { motion } from "framer-motion";
import { useRef } from "react";

const toolBoxItems = [
  {
    title: "HTML5",
    iconType: HtmlIcon,
  },
  {
    title: "CSS3",
    iconType: CssIcon,
  },
  {
    title: "JavaScript",
    iconType: JsIcon,
  },
  {
    title: "PHP",
    iconType: PHPIcon,
  },
  {
    title: "Laravel",
    iconType: LaravelIcon,
  },
  {
    title: "ReactJS",
    iconType: ReactIcon,
  },
  {
    title: "NodeJs",
    iconType: NodeJsIcon,
  },

  {
    title: "GitHub",
    iconType: GitHubIcon,
  },
  {
    title: "Docker",
    iconType: DockerIcon,
  },
];
const hobbies = [
  {
    title: "Reading",
    emoji: "📚",
    left: "5%",
    top: "5%",
  },
  {
    title: "Travelling",
    emoji: "✈️",
    left: "50%",
    top: "0%",
  },
  {
    title: "Walking",
    emoji: "🚶‍♂️",
    left: "10%",
    top: "35%",
  },
  {
    title: "Watching Movies",
    emoji: "🎬",
    left: "35%",
    top: "40%",
  },
  {
    title: "Reading",
    emoji: "📚",
    left: "75%",
    top: "20%",
  },
  {
    title: "Walking",
    emoji: "🚶‍♂️",
    left: "70%",
    top: "45%",
  },
  {
    title: "Watching Movies",
    emoji: "🎬",
    left: "5%",
    top: "65%",
  },
  {
    title: "Walking",
    emoji: "🚶‍♂️",
    left: "30%",
    top: "7%",
  },
  {
    title: "Travelling",
    emoji: "✈️",
    left: "45%",
    top: "70%",
  },
];

export const AboutSection = () => {
  const constraintRef = useRef(null);
  return (
    <div className="py-20 lg:py-28" id="about">
      <div className="container">
        <HeaderSection
          eyebrow="ABOUT ME"
          title="Where Every Moment Tells a Story"
          description="Greetings! I’m Abderrahmane Raquibi, a Full Stack Web Developer located in Morocco."
        />
        <div className="mt-20 flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:grid-cols-3">
            <Card className="h-[320px] md:col-span-2 lg:col-span-1">
              <CardHeader
                eyebrow="My Reads"
                description="Explore The Books Shaping my perspectives."
              />
              <div className="w-40 mx-auto mt-2 md:mt-0">
                <Image src={BookImage} alt="Book Cover" />
              </div>
            </Card>
            <Card className="h-[320px] md:col-span-3 lg:col-span-2">
              <CardHeader
                eyebrow="My ToolBox"
                description="Explore The Tchnologies and Tools I use to craft exceptional
                digital experiences."
              />
              <ToolBoxItems
                items={toolBoxItems}
                itemsWrapperClassName="animate-move-left [animation-duration:30s]"
              />
              <ToolBoxItems
                items={toolBoxItems}
                className="mt-6"
                itemsWrapperClassName="-translate-x-1/2 animate-move-right [animation-duration:20s]"
              />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:grid-cols-3">
            <Card className="h-[320px] flex flex-col md:col-span-3 lg:col-span-2">
              <CardHeader
                className="px-6 py-6"
                eyebrow="Beyond The Code"
                description="Explore My interests and hobbies beyond the digital realm."
              />
              <div className="relative flex-1" ref={constraintRef}>
                {hobbies.map((hobby) => (
                  <motion.div
                    key={hobby.title}
                    className="inline-flex items-center gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute"
                    style={{
                      left: hobby.left,
                      top: hobby.top,
                    }}
                    drag
                    dragConstraints={constraintRef}
                  >
                    <span className="font-medium text-gray-950">
                      {hobby.title}
                    </span>
                    <span className="">{hobby.emoji}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
            <Card className="h-[320px] relative md:col-span-2 lg:col-span-1">
  <Image
    src={MapImage}
    alt="Map Image"
    className="h-full w-full object-cover object-left-top"
  />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:outline-offset-2 after:rounded-full after:outline-gray-950/30">
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-20 animate-ping [animation-duration:2s]"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-10"></div>
    <div className="absolute inset-0 flex justify-center items-center">
      <Image
        src="/favicon.ico"
        alt="Smiling Memoji"
        className="size-16"
      />
    </div>
  </div>
</Card>
          </div>
        </div>
      </div>
    </div>
  );
};
