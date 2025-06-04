"use client";
import { HeaderSection } from "@/components/HeaderSection";
import Image from "next/image";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "AKZIZ Zakaria",
    position: "Full Stack Web Developer @ FreeLancer",
    text: "I had the pleasure of working with Abdo Raquibi, and their expertise truly transformed our project. Their timely delivery and excellent communication made the process smooth and efficient. I highly recommend him for any web development needs.",
    avatar: "/images/memoji-avatar-1.webp",
    rating: 5,
  },
  // {
  //   name: "Head of Design",
  //   position: "Head of Design @ GreenLeaf",
  //   text: "Working with Anas was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
  //   avatar: memojiAvatar2,
  // },
  {
    name: "BELAID Abderrahim",
    position: "Full Stack Web Developer @ FreeLancer",
    text: "Working with Abdo has been an enriching experience. His expertise in development, combined with his team spirit and ability to find innovative solutions, has greatly contributed to the success of our projects. A reliable and passionate developer whom I highly recommend.",
    avatar: "/images/memoji-avatar-3.webp",
    rating: 5,
  },
  // {
  //   name: "Emily Carter",
  //   position: "Product Manager @ GlobalTech",
  //   text: "Anas is a true frontend wizard. He took our complex product and transformed it into an intuitive and engaging user interface. We're already seeing positive feedback from our customers.",
  //   avatar: memojiAvatar4,
  // },
  {
    name: "ELALAOUI Abdelkarim",
    position: "Frontend Web Developer @ FreeLancer",
    text: "Collaborating with Abdo Raquibi was a great experience. His skill in designing seamless user experiences and his meticulous attention to detail led to great results. I am very happy with the results I got with him!",
    avatar: "/images/memoji-avatar-6.webp",
    rating: 5,
  },
  {
    name: "ALMOU Oualid",
    position: "Web Designer @ FreeLancer",
    text: "Working on the same team with Abdo was a good experience, because he's very creative and pays close attention to design details and any problem on the project. He's great at analyzing problems and finding solutions, and he's also a good listener when it comes to other people's suggestions.",
    avatar: "/images/memoji-avatar-3.webp",
    rating: 5,
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={cn(
            "w-4 h-4",
            index < rating ? "text-yellow-400" : "text-gray-600"
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <HeaderSection
          eyebrow="Happy Clients"
          title="What Clients Say About Me"
          description="As a full-stack web developer, I help bring client visions to life. Here's what they have to say."
        />
        
        <div className="mt-12 lg:mt-20">
          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 h-full hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex gap-4 items-start">
                      <div className="relative size-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl p-0.5">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl blur-md opacity-50"></div>
                        <div className="relative size-full bg-gray-900 rounded-2xl overflow-hidden">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                            <p className="text-sm text-white/60">{testimonial.position}</p>
                          </div>
                          <RatingStars rating={testimonial.rating} />
                        </div>
                      </div>
                    </div>
                    <p className="mt-6 text-white/80 leading-relaxed flex-1">
                      {testimonial.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: `${-activeIndex * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.name} className="w-full flex-shrink-0 px-4">
                      <Card className="p-6">
                        <div className="flex flex-col">
                          <div className="flex gap-4 items-start">
                            <div className="relative size-14 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl p-0.5">
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl blur-md opacity-50"></div>
                              <div className="relative size-full bg-gray-900 rounded-xl overflow-hidden">
                                <Image
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{testimonial.name}</h3>
                                  <p className="text-sm text-white/60">{testimonial.position}</p>
                                </div>
                                <RatingStars rating={testimonial.rating} />
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-white/80 leading-relaxed">
                            {testimonial.text}
                          </p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "size-2 rounded-full transition-all duration-300",
                      activeIndex === index
                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400 w-8"
                        : "bg-white/20 hover:bg-white/40"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
