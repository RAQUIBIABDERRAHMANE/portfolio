import memojiAvatar1 from "@/assets/images/memoji-avatar-1.webp";
import memojiAvatar2 from "@/assets/images/memoji-avatar-2.webp";
import memojiAvatar3 from "@/assets/images/memoji-avatar-3.webp";
import memojiAvatar4 from "@/assets/images/memoji-avatar-4.webp";
import memojiAvatar5 from "@/assets/images/memoji-avatar-5.webp";
import memojiAvatar6 from "@/assets/images/memoji-avatar-6.webp";
import { HeaderSection } from "@/components/HeaderSection";
import Image from "next/image";
import { Card } from "@/components/Card";
import { Fragment } from "react";

const testimonials = [
  {
    name: "AKZIZ Zakaria",
    position: "Full Stack Web Developer @ FreeLancer",
    text: "I had the pleasure of working with Abdo Raquibi, and their expertise truly transformed our project. Their timely delivery and excellent communication made the process smooth and efficient. I highly recommend him for any web development needs.",
    avatar: memojiAvatar1,
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
    avatar: memojiAvatar3,
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
    avatar: memojiAvatar6,
  },
  {
    name: "ALMOU Oualid",
    position: "Web Designer @ FreeLancer",
    text: "Working on the same team with Abdo was a good experience, because he’s very creative and pays close attention to design details and any problem on the project. He’s great at analyzing problems and finding solutions, and he’s also a good listener when it comes to other people's suggestions.",
    avatar: memojiAvatar3,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <HeaderSection
          eyebrow="Happy Clients"
          title="What Clients Say About Me"
          description="As a full-stack web developer, I help bring client visions to life. Here’s what they have to say."
        />
        <div className="mt-12 lg:mt-20 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4">
          <div className="flex gap-8 pr-8 flex-none animate-move-left [animation-duration:90s] hover:[animation-play-state:paused]">
            {Array.from({ length: 2 }).map((_, index) => (
              <Fragment key={index}>
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.name}
                    className="max-w-xs md:max-w-md p-6 md:p-8 hover:-rotate-3 transition duration-300"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="size-14 bg-gray-700 inline-flex items-center justify-center rounded-full flex-shrink-0">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="max-h-full"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-white/40">
                          {testimonial.position}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 md:mt-6 text-sm md:text-base">
                      {testimonial.text}
                    </p>
                  </Card>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
