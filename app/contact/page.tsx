"use client";

import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        Nom: "",
        Prenom: "",
        Societe: "Non",
        Mail: "",
        Tel: "",
        Type_Evenement: "Mariage",
        Date: ""
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (name === "Mail" || name === "Tel") {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
            e.currentTarget.submit();
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white shadow-xl p-8 md:p-12 rounded-sm border-t-4 border-primary">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl font-serif text-black mb-2">Contactez-nous</h1>
                        <p className="text-gray-500 font-light">
                            Parlons de votre prochain événement. Remplissez le formulaire ci-dessous.
                        </p>
                    </header>

                    <form action="https://formspree.io/f/xvzbpbjd" method="POST" className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Nom</label>
                                <input
                                    type="text"
                                    name="Nom"
                                    required
                                    value={formData.Nom}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
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
                                    className="w-full p-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
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
                                    className={`w-full p-3 border ${errors.Mail ? "border-red-500" : "border-gray-300"} focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors`}
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
                                    className={`w-full p-3 border ${errors.Tel ? "border-red-500" : "border-gray-300"} focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors`}
                                    placeholder="0470 12 34 56"
                                />
                                {errors.Tel && <p className="text-red-500 text-sm">{errors.Tel}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Type d'événement</label>
                                <select
                                    name="Type_Evenement"
                                    value={formData.Type_Evenement}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                >
                                    <option value="Mariage">Mariage</option>
                                    <option value="Banquet">Banquet</option>
                                    <option value="Entreprise">Entreprise</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Date</label>
                                <input
                                    type="date"
                                    name="Date"
                                    required
                                    value={formData.Date}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-primary transition-colors duration-300 mt-8"
                        >
                            Envoyer la demande
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
