"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Leaf } from "lucide-react";

export default function Contact() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ContactForm />
        </Suspense>
    );
}

const viandes = ["Saucisse de Campagne", "Merguez", "Chipolata", "Brochette de Bœuf marinée", "Brochette de Poulet", "Lard mariné", "Spare Ribs au Miel", "Côte d'Agneau (+suppl)"];
const chauds = ["Pomme de terre en chemise", "Gratin Dauphinois", "Grenailles au Romarin", "Riz aux légumes"];
const froids = ["Salade de Pâtes au Pesto", "Salade Grecque (Feta/Olives)", "Taboulé Oriental", "Tomate Mozzarella", "Salade de Pomme de Terre"];

function ContactForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        Prenom: "",
        Nom: "",
        Societe: "Non", // Checkbox state ("Oui" or "Non")
        Nom_Societe: "", // Dynamic field if Societe "Oui"
        Mail: "",
        Tel: "",
        Type_Evenement: "Mariage",
        type_autre: "",
        Date: "",
        Nombre_Convives: "Moins de 20", // New Field
        details_projet: "",
        Souhaite_etre_recontacte: "Non",
        // BBQ Fields
        viande_1: "",
        viande_2: "",
        viande_3: "",
        viande_4: "",
        viande_5: "",
        accomp_chaud: "",
        accomp_froid: ""
    });

    const menuParam = searchParams.get('menu');
    const isBBQ = menuParam === 'bbq' || menuParam === 'bbq_sur_mesure';
    const meatCount = parseInt(searchParams.get('count') || '3');

    // EFFECT: Check for URL params (e.g. ?convives=Plus de 100)
    useEffect(() => {
        const convivesParam = searchParams.get("convives");
        if (convivesParam) {
            // Verify it's a valid option to avoid unwanted strings
            const validOptions = [
                "Moins de 20", "20 à 50", "50 à 100", "Plus de 100",
                "Moins de 30", "30 à 80", "Plus de 80" // New BBQ ranges
            ];

            if (validOptions.includes(convivesParam)) {
                setFormData(prev => ({ ...prev, Nombre_Convives: convivesParam }));
            }
        }
    }, [searchParams]);

    const [errors, setErrors] = useState({
        Mail: "",
        Tel: ""
    });

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const getPhoneError = (phone: string) => {
        const cleanPhone = phone.replace(/[\s./]/g, "");
        if (!cleanPhone) return "Le numéro de téléphone est requis.";
        if (!cleanPhone.startsWith("0")) return "Le numéro doit commencer par 0.";
        if (/^(046|047|048|049)/.test(cleanPhone)) {
            if (cleanPhone.length !== 10) return "Un GSM doit contenir 10 chiffres (ex: 0470...).";
            return "";
        }
        if (cleanPhone.length !== 9) return "Un numéro fixe doit contenir 9 chiffres (ex: 04 336... ou 02...).";
        return "";
    };

    // Date Logic
    const getMinDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) return;

        const selectedDate = new Date(val);
        const minDate = new Date(getMinDate());

        if (selectedDate < minDate) {
            setFormData(prev => ({ ...prev, Date: getMinDate() }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked ? "Oui" : "Non",
                // Reset conditional field if unchecked
                ...(name === "Societe" && !checked ? { Nom_Societe: "" } : {})
            }));
            return;
        }

        if (name === "Tel") {
            let cleanVal = value.replace(/\D/g, "");
            let maxLength = 9;
            if (/^(046|047|048|049)/.test(cleanVal)) maxLength = 10;
            if (cleanVal.length > maxLength) cleanVal = cleanVal.slice(0, maxLength);

            let formattedVal = cleanVal;
            if (maxLength === 10) {
                if (cleanVal.length > 4) formattedVal = cleanVal.slice(0, 4) + " " + cleanVal.slice(4);
                if (cleanVal.length > 6) formattedVal = formattedVal.slice(0, 7) + " " + cleanVal.slice(6);
                if (cleanVal.length > 8) formattedVal = formattedVal.slice(0, 10) + " " + cleanVal.slice(8);
            } else {
                if (cleanVal.length > 2) formattedVal = cleanVal.slice(0, 2) + " " + cleanVal.slice(2);
                if (cleanVal.length > 5) formattedVal = formattedVal.slice(0, 6) + " " + cleanVal.slice(5);
                if (cleanVal.length > 7) formattedVal = formattedVal.slice(0, 9) + " " + cleanVal.slice(7);
            }

            setFormData(prev => ({ ...prev, [name]: formattedVal }));
            setErrors(prev => ({ ...prev, [name]: "" }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "Mail") setErrors(prev => ({ ...prev, [name]: "" }));
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
                    headers: { "Accept": "application/json" },
                    body: new FormData(e.currentTarget)
                });

                if (response.ok) {
                    setStatus("success");
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'generate_lead', {
                            'event_category': 'form',
                            'event_label': 'contact_form_success',
                            'transport_type': 'beacon',
                            'debug_mode': true
                        });
                    }
                    setTimeout(() => router.push("/"), 3000);
                } else {
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
            }
        }
    };

    // Shared Styles
    const inputStyle = `w-full bg-white border border-neutral-200 rounded-xl px-5 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-300 shadow-inner text-base`;
    const labelStyle = `block text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2 ml-1`;

    return (
        <main className="min-h-screen pt-32 pb-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100 relative overflow-hidden">
            {/* --- DECORATIVE BACKGROUND ELEMENTS --- */}

            {/* Blurred Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0 pointer-events-none" />

            {/* Subtle Leaf Icons */}
            <div className="absolute top-20 right-10 opacity-[0.03] z-0 rotate-12 pointer-events-none hidden lg:block">
                <Leaf size={300} strokeWidth={1} />
            </div>
            <div className="absolute bottom-40 left-10 opacity-[0.03] z-0 -rotate-45 pointer-events-none hidden lg:block">
                <Leaf size={250} strokeWidth={1} />
            </div>
            <div className="absolute top-1/2 left-20 opacity-[0.02] z-0 rotate-90 pointer-events-none hidden lg:block">
                <Leaf size={150} strokeWidth={1} />
            </div>
            <div className="absolute top-1/3 right-1/4 opacity-[0.02] z-0 -rotate-12 pointer-events-none hidden lg:block">
                <Leaf size={100} strokeWidth={1} />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="bg-white shadow-2xl p-8 md:p-14 rounded-[2rem] border-t-4 border-[#D4AF37]">

                    <header className="text-center mb-14">
                        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">Contactez-nous&nbsp;!</h1>
                        <p className="text-gray-500 font-light text-lg">
                            Parlons de votre prochain événement. Remplissez le formulaire ci-dessous.
                        </p>
                    </header>

                    {status === "success" ? (
                        <div className="text-center py-12 space-y-6 animate-fade-in">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-serif text-gray-900">Merci !</h2>
                            <p className="text-gray-600 text-xl max-w-md mx-auto leading-relaxed">
                                Votre demande a bien été envoyée. Nous vous recontacterons très vite.
                            </p>
                            <p className="text-sm text-gray-400 mt-10 animate-pulse">
                                Redirection vers l'accueil...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-8">
                            {status === "error" && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center shadow-sm">
                                    Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                                </div>
                            )}

                            {/* PRENOM & NOM (Inverted) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className={labelStyle}>Prénom</label>
                                    <input
                                        type="text"
                                        name="Prenom"
                                        required
                                        value={formData.Prenom}
                                        onChange={handleChange}
                                        className={inputStyle}
                                        placeholder="Votre prénom"
                                    />
                                </div>
                                <div className="group">
                                    <label className={labelStyle}>Nom</label>
                                    <input
                                        type="text"
                                        name="Nom"
                                        required
                                        value={formData.Nom}
                                        onChange={handleChange}
                                        className={inputStyle}
                                        placeholder="Votre nom"
                                    />
                                </div>
                            </div>

                            {/* SOCIETE CHECKBOX & DYNAMIC INPUT */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <input
                                        type="checkbox"
                                        name="Societe"
                                        id="Societe"
                                        className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                                        checked={formData.Societe === "Oui"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="Societe" className="text-neutral-700 font-medium cursor-pointer select-none">
                                        Je représente une société
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {formData.Societe === "Oui" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <label className={labelStyle}>Nom de l'entreprise</label>
                                            <input
                                                type="text"
                                                name="Nom_Societe"
                                                className={inputStyle}
                                                placeholder="Ex : Colruyt Group"
                                                value={formData.Nom_Societe}
                                                onChange={handleChange}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* MAIL & TEL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className={labelStyle}>Email</label>
                                    <input
                                        type="email"
                                        name="Mail"
                                        required
                                        value={formData.Mail}
                                        onChange={handleChange}
                                        className={`${inputStyle} ${errors.Mail ? "border-red-500 ring-2 ring-red-100" : ""}`}
                                        placeholder="exemple@email.com"
                                    />
                                    {errors.Mail && <p className="text-red-500 text-sm mt-1 ml-1">{errors.Mail}</p>}
                                </div>
                                <div className="group">
                                    <label className={labelStyle}>Téléphone</label>
                                    <input
                                        type="tel"
                                        name="Tel"
                                        required
                                        value={formData.Tel}
                                        onChange={handleChange}
                                        className={`${inputStyle} ${errors.Tel ? "border-red-500 ring-2 ring-red-100" : ""}`}
                                        placeholder="0470 12 34 56"
                                    />
                                    {errors.Tel && <p className="text-red-500 text-sm mt-1 ml-1">{errors.Tel}</p>}
                                </div>
                            </div>

                            {/* TYPE EVENT & DATE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className={labelStyle}>Type d'événement</label>
                                    <div className="relative">
                                        <select
                                            name="Type_Evenement"
                                            value={formData.Type_Evenement}
                                            onChange={handleChange}
                                            className={`${inputStyle} appearance-none cursor-pointer`}
                                        >
                                            <option value="Mariage">Mariage</option>
                                            <option value="Banquet">Banquet</option>
                                            <option value="Entreprise">Entreprise</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {formData.Type_Evenement === "Autre" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            >
                                                <input
                                                    type="text"
                                                    name="type_autre"
                                                    required={formData.Type_Evenement === "Autre"}
                                                    value={formData.type_autre}
                                                    onChange={handleChange}
                                                    className={inputStyle}
                                                    placeholder="Précisez le type (ex: Baptême)"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="group">
                                    <label className={labelStyle}>Date de l'événement</label>
                                    <input
                                        type="date"
                                        name="Date"
                                        required
                                        min={getMinDate()}
                                        value={formData.Date}
                                        onChange={handleChange}
                                        onBlur={handleDateBlur}
                                        className={`${inputStyle} accent-[#D4AF37] cursor-pointer`}
                                        style={{ colorScheme: 'light' }}
                                    />
                                    <p className="text-xs text-neutral-400 italic mt-2 ml-1">
                                        Veuillez prévoir un délai minimum de 7 jours.
                                    </p>
                                </div>
                            </div>

                            {/* NOMBRE DE CONVIVES */}
                            <div className="group">
                                <label className={`${labelStyle} flex items-center gap-2`}>
                                    <Users size={16} className="text-neutral-400" />
                                    Nombre de convives
                                </label>
                                <div className="relative">
                                    <select
                                        name="Nombre_Convives"
                                        value={formData.Nombre_Convives}
                                        onChange={handleChange}
                                        className={`${inputStyle} appearance-none cursor-pointer`}
                                    >
                                        <option value="Moins de 20">Moins de 20</option>
                                        <option value="20 à 50">20 à 50</option>
                                        <option value="50 à 100">50 à 100</option>
                                        <option value="Plus de 100">Plus de 100</option>
                                        {/* Hidden options dynamically selected via URL but available if needed */}
                                        <option disabled>--- Options BBQ ---</option>
                                        <option value="Moins de 30">Moins de 30</option>
                                        <option value="30 à 80">30 à 80</option>
                                        <option value="Plus de 80">Plus de 80</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* BBQ COMPOSITION SECTION */}
                            <AnimatePresence>
                                {isBBQ && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-neutral-50/50 border border-[#D4AF37]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm relative">
                                            {/* Golden accent line */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#D4AF37] rounded-b-full"></div>

                                            <h3 className="text-xl font-serif text-center text-neutral-800 mb-6 font-bold">
                                                Votre Composition Barbecue
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {Array.from({ length: meatCount }).map((_, i) => {
                                                    const num = i + 1;
                                                    return (
                                                        <div key={`viande_${num}`} className="group">
                                                            <label className={labelStyle}>Viande {num}</label>
                                                            <div className="relative">
                                                                <select
                                                                    name={`viande_${num}`}
                                                                    value={(formData as any)[`viande_${num}`]}
                                                                    onChange={handleChange}
                                                                    className={`${inputStyle} appearance-none cursor-pointer`}
                                                                >
                                                                    <option value="">Choisir une viande...</option>
                                                                    {viandes.map((v) => (
                                                                        <option key={v} value={v}>{v}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-neutral-200">
                                                <div className="group">
                                                    <label className={labelStyle}>Accompagnement Chaud</label>
                                                    <div className="relative">
                                                        <select
                                                            name="accomp_chaud"
                                                            value={formData.accomp_chaud}
                                                            onChange={handleChange}
                                                            className={`${inputStyle} appearance-none cursor-pointer`}
                                                        >
                                                            <option value="">Choisir...</option>
                                                            {chauds.map((c) => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className={labelStyle}>Accompagnement Froid</label>
                                                    <div className="relative">
                                                        <select
                                                            name="accomp_froid"
                                                            value={formData.accomp_froid}
                                                            onChange={handleChange}
                                                            className={`${inputStyle} appearance-none cursor-pointer`}
                                                        >
                                                            <option value="">Choisir...</option>
                                                            {froids.map((f) => (
                                                                <option key={f} value={f}>{f}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* DETAILS PROJET */}
                            <div className="group">
                                <label className={labelStyle}>Dites-nous en plus !</label>
                                <textarea
                                    name="details_projet"
                                    value={formData.details_projet}
                                    onChange={handleChange}
                                    className={`${inputStyle} h-40 resize-y`}
                                    placeholder="Décrivez votre projet : ambiance, allergies, régimes spéciaux, déroulement souhaité..."
                                />
                            </div>

                            {/* RECONTACT */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="Souhaite_etre_recontacte"
                                    id="Souhaite_etre_recontacte"
                                    className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                                    checked={formData.Souhaite_etre_recontacte === "Oui"}
                                    onChange={handleChange}
                                />
                                <label htmlFor="Souhaite_etre_recontacte" className="text-neutral-700 font-medium cursor-pointer select-none">
                                    Je souhaite être recontacté pour discuter de mon devis.
                                </label>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className={`w-full bg-black text-white py-5 uppercase tracking-widest text-sm font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-[#D4AF37] hover:-translate-y-1 transition-all duration-300 transform active:scale-95 ${status === "submitting" ? "opacity-75 cursor-not-allowed" : ""}`}
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
