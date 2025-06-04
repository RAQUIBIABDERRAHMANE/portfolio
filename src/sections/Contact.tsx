"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { HeaderSection } from "@/components/HeaderSection";
import Image from "next/image";
import { cn } from "@/lib/utils";

const socialLinks = [
  {
    name: "GitHub",
    icon: "/icons/github.svg",
    url: "https://github.com/abderrahmaneraquibi",
  },
  {
    name: "LinkedIn",
    icon: "/icons/linkedin.svg",
    url: "https://linkedin.com/in/abderrahmaneraquibi",
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    url: "https://instagram.com/abderrahmaneraquibi1",
  },
];

const contactMethods = [
  {
    name: "WhatsApp",
    icon: "/icons/whatsapp.svg",
    value: "+212665830816",
    action: (value: string) => window.open(`https://wa.me/${value}`, "_blank"),
  },
  {
    name: "Email",
    icon: "/icons/email.svg",
    value: "abderrahmaneraquibi@gmail.com",
    action: (value: string) => window.open(`mailto:${value}`, "_blank"),
  },
];

export const ContactSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <HeaderSection
          eyebrow="Get in Touch"
          title="Let's Create Something Amazing Together"
          description="Ready to bring your next project to life? Let's connect and discuss how I can help you achieve your goals."
        />

        <div className="mt-12 lg:mt-20 space-y-8">
          {/* Direct Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Direct Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactMethods.map((method) => (
                  <motion.button
                    key={method.name}
                    onClick={() => method.action(method.value)}
                    className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="size-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl p-0.5">
                      <div className="size-full bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image
                          src={method.icon}
                          alt={method.name}
                          width={24}
                          height={24}
                          className="size-6"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-lg">{method.name}</div>
                      <div className="text-sm text-white/60">{method.value}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Connect on Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="size-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl p-0.5">
                      <div className="size-full bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image
                          src={social.icon}
                          alt={social.name}
                          width={32}
                          height={32}
                          className="size-8"
                        />
                      </div>
                    </div>
                    <span className="font-medium text-lg">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
