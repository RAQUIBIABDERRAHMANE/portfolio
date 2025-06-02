import VirtualRLandingPage from "@/assets/images/VirtualR.webp";
import HRMImage from "@/assets/images/veneroo.webp";
import MedicareplusImage from "@/assets/images/medicareplus.webp";
import DefpImage from "@/assets/images/mng.jpg";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import Image from "next/image";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import { memo } from "react";

const portfolioProjects = [
  {
    company: "EquipTrack",
    year: "2025",
    title: "Equipment Tracking & Movement",
    results: [
      { title: "Manage all equipment in one place" },
      { title: "Track equipment movements between services" },
      { title: "Filter by department or service" },
      {
        title: "Easily add new equipment",
      },
      { title: "Status indicators: available, moved, or broken" },
      { title: "Visualize usage with movement charts" },
    ],
    link: "https://github.com/RAQUIBIABDERRAHMANE/gestion_m6",
    image: DefpImage,
    text: "GitHub Source Code",
  },
  {
    company: "Veneroo",
    year: "2024",
    title: "ERP Project",
    results: [
      { title: "Implemented efficient attendance tracking system" },
      { title: "Developed robust absence recording features" },
      { title: "Integrated holiday management functionality" },
      { title: "Optimized employee salary processing" },
      { title: "Streamlined project management tools" },
    ],
    link: "https://buymeacoffee.com/anaser_25/e/298045",
    image: HRMImage,
    text: "Get Source Code",
  },
  {
    company: "Academic",
    year: "2024",
    title: "VirtualR Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://buymeacoffee.com/anaser_25/e/297849",
    image: VirtualRLandingPage,
    text: "Get Source Code",
  },
  {
    company: "Veneroo",
    year: "2023",
    title: "Medical website",
    results: [
      { title: "Developing a medical website" },
      { title: "Develeped and maintained client websites" },
      { title: "Collaborated with cross-functional teams" },
      {
        title: "Implemented responsive design and cross-browser compatibility",
      },
    ],
    link: "https://medicareplus.ma/",
    image: MedicareplusImage,
    text: "Vist Live Site",
  },
];

export const ProjectsSection = () => {
  return (
    <section className="pb-16 lg:py-24" id="project">
      <div className="container">
        <HeaderSection
          eyebrow="CURATED WORK"
          title="Featured Case Studies"
          description="Compilation of case studies that evoke my sense of pride"
        />
        <div className="mt-10 md:mt-20 flex flex-col gap-20">
          {portfolioProjects.map((project, projectIndex) => (
            <Card
              key={project.title}
              className="px-8 pt-8 pb-0 md:pt-12 md:px-10 lg:pt-16 lg:px-20 sticky"
              style={{
                top: `calc(64px + ${projectIndex * 40}px`,
              }}
            >
              <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                <div className="lg:pb-16">
                  <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm gap-2 text-transparent bg-clip-text">
                    <span>{project.company}</span>
                    <span>&bull;</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-serif text-2xl mt-2 md:mt-5 md:text-4xl">
                    {project.title}
                  </h3>
                  <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                  <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                    {project.results.map((result) => (
                      <li
                        key={result.title}
                        className="flex gap-2 text-sm md:text-base text-white/50"
                      >
                        <CheckIcon className="size-5 md:size-6" />
                        <span>{result.title}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={project.link} target="_blank">
                    <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-2 mt-8">
                      <span>{project.text}</span>
                      <ArrowUpRightIcon className="size-4" />
                    </button>
                  </a>
                </div>
                <div className="relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="mt-8 -mb-4 md:-mb-0 lg:mt-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none"
                    loading={projectIndex < 2 ? "eager" : "lazy"}
                    priority={projectIndex < 2}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
