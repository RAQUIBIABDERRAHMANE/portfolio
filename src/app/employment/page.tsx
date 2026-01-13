"use client";

import { useState, FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import { HeaderSection } from "@/components/HeaderSection";
import { Card } from "@/components/Card";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { PageGuard } from "@/components/PageGuard";
import { 
    User, 
    Mail, 
    Phone, 
    Calendar,
    Briefcase,
    Github,
    DollarSign,
    FileText,
    CheckCircle,
    Send,
    Shield,
    Upload,
    Linkedin,
    Globe,
    Building2,
    Code,
    CreditCard,
    Image
} from "lucide-react";

const techStackOptions = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
    "Node.js", "Express", "NestJS", "Python", "Django", "FastAPI",
    "Java", "Spring Boot", "C#", ".NET", "Go", "Rust",
    "PHP", "Laravel", "Ruby", "Rails", "Swift", "Kotlin",
    "React Native", "Flutter", "Electron", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "PostgreSQL", "MySQL", "MongoDB",
    "Redis", "GraphQL", "REST API", "Git", "CI/CD", "Linux"
];

export default function EmploymentPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [userImage, setUserImage] = useState<File | null>(null);
    
    const [formData, setFormData] = useState({
        // Section 1: Agreement & Identity
        fullName: "",
        email: "",
        phone: "",
        idNumber: "",
        startDate: "",
        position: "Software Developer",
        agreementAccepted: false,
        
        // Section 2: Professional Verification
        githubUrl: "",
        portfolioUrl: "",
        linkedinUrl: "",
        skills: [] as string[],
        
        // Section 3: Compensation
        fixedSalary: "",
        hasFixedSalary: true,
        revenueSharePercentage: "",
        paymentConditionAccepted: false,
        remoteWorkConditionAccepted: false,
        
        // Section 4: Legal Acknowledgements
        ndaAccepted: false,
        ownershipAccepted: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === "radio") {
            const radioValue = (e.target as HTMLInputElement).value === "true";
            setFormData(prev => ({ ...prev, [name]: radioValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Please upload a PDF file only");
                e.target.value = "";
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File size must be less than 5MB");
                e.target.value = "";
                return;
            }
            setCvFile(file);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload an image file only");
                e.target.value = "";
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Image size must be less than 2MB");
                e.target.value = "";
                return;
            }
            setUserImage(file);
        }
    };



    const validateForm = () => {
        // At least one professional link required
        if (!formData.githubUrl && !formData.portfolioUrl && !formData.linkedinUrl) {
            setMessage("Please provide at least one professional link (GitHub, Portfolio, or LinkedIn)");
            return false;
        }

        // At least one skill required
        if (formData.skills.length === 0) {
            setMessage("Please select at least one skill or technology");
            return false;
        }

        if (!cvFile) {
            setMessage("Please upload your CV/Resume (PDF only)");
            return false;
        }

        if (!userImage) {
            setMessage("Please upload your photo");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        if (!validateForm()) {
            setStatus("error");
            return;
        }

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    submitData.append(key, value.join(", "));
                } else {
                    submitData.append(key, String(value));
                }
            });
            
            if (cvFile) {
                submitData.append("cv", cvFile);
            }
            
            if (userImage) {
                submitData.append("userImage", userImage);
            }
            
            submitData.append("submittedAt", new Date().toISOString());
            submitData.append("companyName", "FirstStep");
            submitData.append("employerName", "Abderrahmane Raquibi");

            // Save to local database first
            const dbResponse = await fetch("/api/employment", {
                method: "POST",
                body: submitData,
            });

            if (!dbResponse.ok) {
                const dbError = await dbResponse.json();
                if (dbResponse.status === 409) {
                    setStatus("error");
                    setMessage(dbError.error || "You already have a pending application.");
                    return;
                }
                throw new Error(dbError.error || "Database save failed");
            }

            // Also send to webhook for notifications/processing
            try {
                await fetch("https://n8n.raquibi.com/webhook-test/employment-agreement", {
                    method: "POST",
                    body: submitData,
                });
            } catch (webhookError) {
                // Webhook failure is non-critical, data is already saved in DB
                console.warn("Webhook notification failed:", webhookError);
            }

            setStatus("success");
            setMessage("Your employment agreement has been submitted successfully! We will review and contact you soon.");
        } catch (error) {
            setStatus("error");
            setMessage("Connection error. Please try again later.");
        }
    };

    const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all";
    const labelClass = "block text-sm font-medium text-white/90 mb-2 flex items-center gap-2";
    const sectionClass = "space-y-6";

    if (status === "success") {
        return (
            <PageGuard>
                <div className="min-h-screen bg-[#020617] text-white">
                    <Header />
                    <main className="container max-w-3xl py-32 lg:py-40">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <Card className="p-12">
                                <div className="size-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-emerald-400" size={48} />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Agreement Submitted!</h2>
                                <p className="text-white/60 mb-8">{message}</p>
                                <button
                                    onClick={() => window.location.href = "/"}
                                    className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-xl hover:bg-cyan-400 transition-all"
                                >
                                    Return to Home
                                </button>
                            </Card>
                        </motion.div>
                    </main>
                    <Footer />
                </div>
            </PageGuard>
        );
    }

    return (
        <PageGuard>
            <div className="min-h-screen bg-[#020617] text-white">
            <Header />
            <main className="container max-w-4xl py-32 lg:py-40">
                <HeaderSection
                    eyebrow="FirstStep Employment"
                    title="Developer Employment Agreement"
                    description="Complete this legally binding agreement to join FirstStep as a developer. All information will be verified before final approval."
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Agreement & Identity Information */}
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="size-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                    <User className="text-cyan-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">1. Agreement & Identity Information</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                        <User size={16} className="text-cyan-400" />
                                        Full Legal Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40 transition-all"
                                        placeholder="Enter your full legal name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                            <Mail size={16} className="text-cyan-400" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-white/40"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                            <Phone size={16} className="text-cyan-400" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-white/40"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                        <CreditCard size={16} className="text-cyan-400" />
                                        CIN / Passport ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        value={formData.idNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-white/40"
                                        placeholder="Enter your CIN or Passport number"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                            <Calendar size={16} className="text-cyan-400" />
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                            <Briefcase size={16} className="text-cyan-400" />
                                            Position Held
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-white/40"
                                            placeholder="Software Developer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Section 2: Professional Verification */}
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="size-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                    <FileText className="text-emerald-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">2. Professional Verification</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                        <Upload size={16} className="text-emerald-400" />
                                        CV / Resume (PDF only) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleCvUpload}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-gray-900 file:font-medium hover:file:bg-emerald-400"
                                        />
                                        {cvFile && <p className="mt-2 text-sm text-emerald-400">✓ {cvFile.name} uploaded</p>}
                                    </div>
                                    <p className="mt-2 text-xs text-white/50">Maximum file size: 5MB</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                        <Image size={16} className="text-emerald-400" />
                                        Your Photo *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-gray-900 file:font-medium hover:file:bg-emerald-400"
                                        />
                                        {userImage && <p className="mt-2 text-sm text-emerald-400">✓ {userImage.name} uploaded</p>}
                                    </div>
                                    <p className="mt-2 text-xs text-white/50">Maximum file size: 2MB</p>
                                </div>

                                <div>
                                    <p className="text-sm text-white/70 mb-4">
                                        * At least one professional link is required (GitHub, Portfolio, or LinkedIn)
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                                <Github size={16} className="text-emerald-400" />
                                                GitHub Profile URL
                                            </label>
                                            <input
                                                type="url"
                                                name="githubUrl"
                                                value={formData.githubUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/40"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                                <Globe size={16} className="text-emerald-400" />
                                                Portfolio Website URL
                                            </label>
                                            <input
                                                type="url"
                                                name="portfolioUrl"
                                                value={formData.portfolioUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/40"
                                                placeholder="https://yourportfolio.com"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                                <Linkedin size={16} className="text-emerald-400" />
                                                LinkedIn Profile URL
                                            </label>
                                            <input
                                                type="url"
                                                name="linkedinUrl"
                                                value={formData.linkedinUrl}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/40"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skills & Technologies */}
                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-3 flex items-center gap-2">
                                        <Code size={16} className="text-emerald-400" />
                                        Skills & Technologies *
                                    </label>
                                    <p className="text-xs text-white/50 mb-3">Select all technologies you are proficient in</p>
                                    <div className="flex flex-wrap gap-2">
                                        {techStackOptions.map(tech => (
                                            <button
                                                key={tech}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        skills: prev.skills.includes(tech)
                                                            ? prev.skills.filter(s => s !== tech)
                                                            : [...prev.skills, tech]
                                                    }));
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    formData.skills.includes(tech)
                                                        ? "bg-emerald-500 text-gray-900"
                                                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                                                }`}
                                            >
                                                {tech}
                                            </button>
                                        ))}
                                    </div>
                                    {formData.skills.length > 0 && (
                                        <p className="mt-3 text-sm text-emerald-400">
                                            ✓ {formData.skills.length} technologie(s) sélectionnée(s)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Section 3: Compensation Information */}
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="size-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                    <DollarSign className="text-purple-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">3. Compensation Information</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-3">
                                        Fixed Salary
                                    </label>
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="hasFixedSalary"
                                                value="true"
                                                checked={formData.hasFixedSalary}
                                                onChange={handleChange}
                                                className="size-4 text-purple-500 focus:ring-purple-500"
                                            />
                                            <span className="text-sm">Has fixed salary</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="hasFixedSalary"
                                                value="false"
                                                checked={!formData.hasFixedSalary}
                                                onChange={handleChange}
                                                className="size-4 text-purple-500 focus:ring-purple-500"
                                            />
                                            <span className="text-sm">No fixed salary</span>
                                        </label>
                                    </div>
                                    
                                    {formData.hasFixedSalary && (
                                        <input
                                            type="number"
                                            name="fixedSalary"
                                            value={formData.fixedSalary}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                                            placeholder="Enter annual salary amount"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                                        <DollarSign size={16} className="text-purple-400" />
                                        Revenue Share Percentage (per project) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="revenueSharePercentage"
                                            value={formData.revenueSharePercentage}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                                            placeholder="e.g., 15"
                                        />
                                        <span className="absolute right-4 top-3 text-white/50">%</span>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="paymentConditionAccepted"
                                            checked={formData.paymentConditionAccepted}
                                            onChange={handleChange}
                                            required
                                            className="size-5 mt-0.5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                            <strong className="text-white">Payment Condition:</strong> I understand that payment is issued only after the client has fully paid FirstStep for the project. *
                                        </span>
                                    </label>
                                    
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remoteWorkConditionAccepted"
                                            checked={formData.remoteWorkConditionAccepted}
                                            onChange={handleChange}
                                            required
                                            className="size-5 mt-0.5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                            <strong className="text-white">Remote Work Condition:</strong> I understand that if I do not contribute to a project, I will not receive payment for that project. *
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </Card>

                        {/* Section 4: Legal Acknowledgements */}
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="size-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                    <Shield className="text-amber-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">4. Legal Acknowledgements</h3>
                            </div>
                            <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="ndaAccepted"
                                        checked={formData.ndaAccepted}
                                        onChange={handleChange}
                                        required
                                        className="size-5 mt-0.5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                        <strong className="text-white">NDA:</strong> I will keep confidential all source code, business ideas, and client data. NDA survives termination. *
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="ownershipAccepted"
                                        checked={formData.ownershipAccepted}
                                        onChange={handleChange}
                                        required
                                        className="size-5 mt-0.5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                        <strong className="text-white">Ownership:</strong> All code, designs, and projects are 100% owned by FirstStep. *
                                    </span>
                                </label>
                            </div>
                        </Card>

                        {/* Section 5: Employer Information */}
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                <div className="size-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                    <Building2 className="text-blue-400" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">5. Employer Information</h3>
                            </div>
                            <div className="space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-sm font-medium text-white/70">Company Name:</span>
                                    <span className="text-white font-bold">FirstStep</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-white/70">Founder / Employer:</span>
                                    <span className="text-white font-bold">Abderrahmane Raquibi</span>
                                </div>
                            </div>
                        </Card>

                        {/* Final Agreement Confirmation */}
                        <Card className="p-8">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="agreementAccepted"
                                        checked={formData.agreementAccepted}
                                        onChange={handleChange}
                                        required
                                        className="size-5 mt-0.5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                        <strong className="text-white">Final Confirmation:</strong> I confirm all information provided is accurate and I agree to the terms of this employment agreement. *
                                    </span>
                                </label>
                            </div>
                        </Card>

                        {/* Status Message */}
                        {message && status === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                            >
                                {message}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full px-6 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 font-bold rounded-2xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                        >
                            {status === "loading" ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting Agreement...
                                </span>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Agreement
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
        </PageGuard>
    );
}
