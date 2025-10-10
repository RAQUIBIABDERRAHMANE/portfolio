import { AboutSection } from "@/sections/About";
import { BlogSection } from "@/sections/Blog";
import { ContactSection } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TechnologieSection } from "@/sections/Technologies";
import { TestimonialsSection } from "@/sections/Testimonials";
import { Metadata } from "next";
import { ServicesSection } from "@/sections/Services";

export const metadata: Metadata = {
  title: "Abdo Raquibi | Full-Stack Developer",
  description: "Full-Stack Web Developer specializing in Laravel, React, and Next.js - Creating modern web experiences",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative">
        <Header />
        <HeroSection />
        <div className="space-y-32 py-32">
          <section aria-label="Services" id="services" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-lime-500/10 blur-3xl"></div>
            <ServicesSection />
          </section>
          <section aria-label="Technologies" id="technologies" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 blur-3xl"></div>
            <TechnologieSection />
          </section>
          <section aria-label="Projects" id="projects" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 blur-3xl"></div>
            <ProjectsSection />
          </section>
          {/* <section aria-label="Blog" id="blog" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 blur-3xl"></div>
            <BlogSection />
          </section> */}
          <section aria-label="Featured Work" id="featured" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
            <TapeSection />
          </section>
          <section aria-label="Testimonials" id="testimonials" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 blur-3xl"></div>
            <TestimonialsSection />
          </section>
          <section aria-label="About Me" id="about" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl"></div>
            <AboutSection />
          </section>
          <section aria-label="Contact" id="contact" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 blur-3xl"></div>
            <ContactSection />
          </section>
        </div>
        <Footer />
      </div>
    </main>
  );
}
