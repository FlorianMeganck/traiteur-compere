"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, BarChart3, Megaphone } from "lucide-react";

interface CookiePreferences {
    essential: boolean;
    analytical: boolean;
    marketing: boolean;
}

function GestionCookiesContent() {
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true, // Always true
        analytical: false,
        marketing: false,
    });
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/';

    useEffect(() => {
        const storedPreferences = localStorage.getItem("cookie_preferences");
        if (storedPreferences) {
            try {
                setPreferences(JSON.parse(storedPreferences));
            } catch (e) {
                console.error("Failed to parse cookie preferences", e);
            }
        }
    }, []);

    const handleToggle = (key: keyof CookiePreferences) => {
        if (key === "essential") return; // Prevent toggling essential
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            router.push(returnTo);
        }, 1000);
    };

    return (
        <main className="min-h-screen bg-neutral-50 py-32 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* --- Header --- */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                        Gestion des Cookies
                    </h1>
                    <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
                        Nous respectons votre vie privée. Choisissez les cookies que vous
                        souhaitez autoriser pour une expérience personnalisée.
                    </p>
                    <div className="w-[1px] h-16 bg-[#D4AF37] mx-auto mt-8 opacity-50"></div>
                </div>

                {/* --- Explanatory Section --- */}
                <section className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-serif text-black mb-4">
                        À propos des cookies
                    </h2>
                    <p className="text-gray-600 leading-relaxed font-light">
                        Les cookies sont de petits fichiers texte stockés sur votre appareil
                        pour améliorer votre expérience de navigation. Nous les utilisons
                        pour assurer le bon fonctionnement du site, analyser notre trafic de
                        manière anonyme et vous proposer des contenus pertinents. Vous
                        gardez un contrôle total sur vos préférences.
                    </p>
                </section>

                {/* --- Preferences Section --- */}
                <section className="space-y-6">
                    {/* Essential Cookies */}
                    <CookieCard
                        title="Cookies Essentiels"
                        description="Nécessaires au fonctionnement du site. Ils permettent la navigation de base et l'accès aux zones sécurisées. Le site ne peut pas fonctionner correctement sans ces cookies."
                        icon={<Shield className="w-6 h-6 text-[#D4AF37]" />}
                        isActive={preferences.essential}
                        isLocked={true}
                        onToggle={() => { }}
                    />

                    {/* Analytical Cookies */}
                    <CookieCard
                        title="Cookies Analytiques"
                        description="Nous aident à comprendre comment vous utilisez le site (pages visitées, temps passé) afin d'améliorer nos services. Ces données sont collectées de manière anonyme."
                        icon={<BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />}
                        isActive={preferences.analytical}
                        isLocked={false}
                        onToggle={() => handleToggle("analytical")}
                    />

                    {/* Marketing Cookies */}
                    <CookieCard
                        title="Cookies Marketing"
                        description="Utilisés pour suivre les visiteurs sur les sites Web. Le but est d'afficher des publicités pertinentes et intéressantes pour l'utilisateur individuel."
                        icon={<Megaphone className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />}
                        isActive={preferences.marketing}
                        isLocked={false}
                        onToggle={() => handleToggle("marketing")}
                    />
                </section>

                {/* --- Save Button --- */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleSave}
                        className="bg-[#D4AF37] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Enregistrer mes préférences
                    </button>
                </div>
            </div>

            {/* --- Toast Notification --- */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
                    >
                        <div className="bg-white/20 p-1 rounded-full">
                            <Check className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">Préférences enregistrées !</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function GestionCookies() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <GestionCookiesContent />
        </Suspense>
    );
}

// --- Components ---

function CookieCard({
    title,
    description,
    icon,
    isActive,
    isLocked,
    onToggle,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    isActive: boolean;
    isLocked: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow duration-300">
            {/* Icon Area */}
            <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-[#F9F7F1] transition-colors duration-300">
                {icon}
            </div>

            {/* Text Area */}
            <div className="flex-1">
                <h3 className="text-xl font-serif text-black mb-2 flex items-center gap-2">
                    {title}
                    {isLocked && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-sans tracking-wide">Requis</span>}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Toggle Area */}
            <div className="self-end md:self-center mt-4 md:mt-0">
                <Switch checked={isActive} onChange={onToggle} disabled={isLocked} />
            </div>
        </div>
    );
}

function Switch({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: () => void;
    disabled: boolean;
}) {
    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${disabled
                ? "bg-gray-200 cursor-not-allowed opacity-50"
                : checked
                    ? "bg-[#D4AF37]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
        >
            <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: checked ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );
}
