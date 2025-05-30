import { AboutSection } from "@/sections/About";
import { ContactSection } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { TapeSection } from "@/sections/Tape";
import { TechnologieSection } from "@/sections/Technologies";
import { TestimonialsSection } from "@/sections/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Abdo Raquibi's portfolio - Full-Stack Web Developer specializing in Laravel, React, and Next.js",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <section aria-label="Technologies" id="technologies">
        <TechnologieSection />
      </section>
      <section aria-label="Projects" id="projects">
        <ProjectsSection />
      </section>
      <section aria-label="Featured Work" id="featured">
        <TapeSection />
      </section>
      <section aria-label="Testimonials" id="testimonials">
        <TestimonialsSection />
      </section>
      <section aria-label="About Me" id="about">
        <AboutSection />
      </section>
      <section aria-label="Contact" id="contact">
        <ContactSection />
      </section>
      <Footer />
    </main>
  );
}
