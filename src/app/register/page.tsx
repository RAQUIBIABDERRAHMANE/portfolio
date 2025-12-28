import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register | Abdo Raquibi Portfolio",
    description: "Join my community and stay updated with my latest projects and services.",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative">
                <Header />
                <div className="py-24 lg:py-32 container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 glow-text text-white">Join the Community</h1>
                        <p className="text-gray-400 text-lg">
                            Fill out the form below to register. You&apos;ll receive a confirmation email once your registration is successful.
                        </p>
                    </div>
                    <RegistrationForm />
                </div>
                <Footer />
            </div>
        </main>
    );
}
