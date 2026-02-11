"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        Nom: "",
        Prenom: "",
        Societe: "Non",
        Mail: "",
        Tel: "",
        Type_Evenement: "Mariage",
        type_autre: "",
        Date: "",
        details_projet: "",
        Souhaite_etre_recontacte: "Non" // Default to Non (unchecked, but we'll use checked state for UI, value for submit)
    });

    const [errors, setErrors] = useState({
        Mail: "",
        Tel: ""
    });

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const getPhoneError = (phone: string) => {
        // Remove spaces, dots, slashes for checking
        const cleanPhone = phone.replace(/[\s./]/g, "");

        // Empty check (although required attribute handles this, good to be safe)
        if (!cleanPhone) return "Le numéro de téléphone est requis.";

        // Check if starts with 0
        if (!cleanPhone.startsWith("0")) return "Le numéro doit commencer par 0.";

        // Check for Mobile (starts with 046, 047, 048, 049)
        if (/^(046|047|048|049)/.test(cleanPhone)) {
            if (cleanPhone.length !== 10) {
                return "Un GSM doit contenir 10 chiffres (ex: 0470...).";
            }
            return ""; // Valid Mobile
        }

        // Check for Fixed (everything else likely, including 04x where x != 6,7,8,9)
        // Standard BE fixed lines are 9 digits.
        if (cleanPhone.length !== 9) {
            return "Un numéro fixe doit contenir 9 chiffres (ex: 04 336... ou 02...).";
        }

        return ""; // Valid Fixed
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked ? "Oui" : "Non" }));
            return;
        }

        if (name === "Tel") {
            // Keep only numbers
            let cleanVal = value.replace(/\D/g, "");

            // Determine Max Length
            let maxLength = 9; // Default (Fixed)
            if (/^(046|047|048|049)/.test(cleanVal)) {
                maxLength = 10; // Mobile
            }

            // Hard Stop at Max Length
            if (cleanVal.length > maxLength) {
                cleanVal = cleanVal.slice(0, maxLength);
            }

            // Formatting
            let formattedVal = cleanVal;
            if (maxLength === 10) {
                // Mobile: 0470 12 34 56
                if (cleanVal.length > 4) {
                    formattedVal = cleanVal.slice(0, 4) + " " + cleanVal.slice(4);
                }
                if (cleanVal.length > 6) {
                    formattedVal = formattedVal.slice(0, 7) + " " + cleanVal.slice(6);
                }
                if (cleanVal.length > 8) {
                    formattedVal = formattedVal.slice(0, 10) + " " + cleanVal.slice(8);
                }
            } else {
                // Fixed (9 digits). Pattern "02 123 45 67" (2-3-2-2) or "04 123 45 67".
                if (cleanVal.length > 2) {
                    formattedVal = cleanVal.slice(0, 2) + " " + cleanVal.slice(2);
                }
                if (cleanVal.length > 5) {
                    formattedVal = formattedVal.slice(0, 6) + " " + cleanVal.slice(5);
                }
                if (cleanVal.length > 7) {
                    formattedVal = formattedVal.slice(0, 9) + " " + cleanVal.slice(7);
                }
            }

            setFormData(prev => ({ ...prev, [name]: formattedVal }));

            // Clear error if valid (or at least changed)
            setErrors(prev => ({ ...prev, [name]: "" }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (name === "Mail") {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = { Mail: "", Tel: "" };
        let isValid = true;

        if (!validateEmail(formData.Mail)) {
            newErrors.Mail = "Veuillez entrer une adresse email valide.";
            isValid = false;
        }

        const phoneError = getPhoneError(formData.Tel);
        if (phoneError) {
            newErrors.Tel = phoneError;
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            setStatus("submitting");

            try {
                const response = await fetch("https://formspree.io/f/xvzbpbjd", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: new FormData(e.currentTarget)
                });

                if (response.ok) {
                    setStatus("success");
                    setFormData({
                        Nom: "",
                        Prenom: "",
                        Societe: "Non",
                        Mail: "",
                        Tel: "",
                        Type_Evenement: "Mariage",
                        type_autre: "",
                        Date: "",
                        details_projet: "",
                        Souhaite_etre_recontacte: "Non"
                    });

                    // Redirect after 3 seconds
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                } else {
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
            }
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white shadow-xl p-8 md:p-12 rounded-sm border-t-4 border-primary">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-serif text-black mb-2">Contactez-nous</h1>
                        <p className="text-gray-500 font-light">
                            Parlons de votre prochain événement. Remplissez le formulaire ci-dessous.
                        </p>
                    </header>

                    {status === "success" ? (
                        <div className="text-center py-12 space-y-6 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif text-gray-900">Merci !</h2>
                            <p className="text-gray-600 text-lg max-w-md mx-auto">
                                Votre demande a bien été envoyée. Nous vous recontacterons très vite.
                            </p>
                            <p className="text-sm text-gray-400 mt-8">
                                Redirection vers l'accueil dans quelques instants...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            {status === "error" && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded text-center">
                                    Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Nom</label>
                                    <input
                                        type="text"
                                        name="Nom"
                                        required
                                        value={formData.Nom}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Prénom</label>
                                    <input
                                        type="text"
                                        name="Prenom"
                                        required
                                        value={formData.Prenom}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                                        placeholder="Votre prénom"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Société ?</label>
                                <div className="flex gap-6 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="Societe"
                                            value="Oui"
                                            checked={formData.Societe === "Oui"}
                                            onChange={handleChange}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-gray-600">Oui</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="Societe"
                                            value="Non"
                                            checked={formData.Societe === "Non"}
                                            onChange={handleChange}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <span className="text-gray-600">Non</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        name="Mail"
                                        required
                                        value={formData.Mail}
                                        onChange={handleChange}
                                        className={`w-full bg-white border ${errors.Mail ? "border-red-500" : "border-neutral-200"} rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300`}
                                        placeholder="exemple@email.com"
                                    />
                                    {errors.Mail && <p className="text-red-500 text-sm">{errors.Mail}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="Tel"
                                        required
                                        value={formData.Tel}
                                        onChange={handleChange}
                                        className={`w-full bg-white border ${errors.Tel ? "border-red-500" : "border-neutral-200"} rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300`}
                                        placeholder="0470 12 34 56"
                                    />
                                    {errors.Tel && <p className="text-red-500 text-sm">{errors.Tel}</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Type d'événement</label>
                                        <select
                                            name="Type_Evenement"
                                            value={formData.Type_Evenement}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 h-[50px]"
                                        >
                                            <option value="Mariage">Mariage</option>
                                            <option value="Banquet">Banquet</option>
                                            <option value="Entreprise">Entreprise</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Date de l'événement</label>
                                        <input
                                            type="date"
                                            name="Date"
                                            required
                                            min={(() => {
                                                const date = new Date();
                                                date.setDate(date.getDate() + 7);
                                                return date.toISOString().split('T')[0];
                                            })()}
                                            value={formData.Date}
                                            onChange={handleChange}
                                            style={{ colorScheme: 'light' }}
                                            className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 h-[50px] accent-[#D4AF37]"
                                        />
                                        <p className="text-xs text-gray-400 italic">
                                            Veuillez prévoir un délai minimum de 7 jours pour l'organisation.
                                        </p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {formData.Type_Evenement === "Autre" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Précisez le type d'événement</label>
                                            <input
                                                type="text"
                                                name="type_autre"
                                                required={formData.Type_Evenement === "Autre"}
                                                value={formData.type_autre}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                                                placeholder="Ex: Anniversaire de mariage, Baptême..."
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Dites-nous en plus !</label>
                                <textarea
                                    name="details_projet"
                                    value={formData.details_projet}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 h-32 resize-y"
                                    placeholder="Décrivez votre projet : ambiance, allergies, régimes spéciaux, déroulement souhaité..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Souhaite_etre_recontacte"
                                    id="Souhaite_etre_recontacte"
                                    value="Oui"
                                    checked={formData.Souhaite_etre_recontacte === "Oui"}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                />
                                <label htmlFor="Souhaite_etre_recontacte" className="text-gray-900 font-medium cursor-pointer select-none">
                                    Je souhaite être recontacté pour discuter de mon devis.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className={`w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-primary transition-all duration-300 mt-8 hover:-translate-y-1 hover:shadow-xl active:scale-95 ${status === "submitting" ? "opacity-75 cursor-not-allowed" : ""}`}
                            >
                                {status === "submitting" ? "Envoi en cours..." : "Envoyer la demande"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
