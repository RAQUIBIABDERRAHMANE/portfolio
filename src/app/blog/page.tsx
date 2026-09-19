import { Metadata } from "next";
import { BlogPage } from "@/components/BlogPage";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Blog | Abdo Raquibi - Full-Stack Developer",
  description: "Read insights, tutorials, and thoughts on web development, technology, and the future of digital experiences.",
};

export default function Blog() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <BlogPage />
      </div>
      <Footer />
    </>
  );
}
