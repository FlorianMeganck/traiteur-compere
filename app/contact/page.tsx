export default function Contact() {
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

                    <form action="https://formspree.io/f/ton_form_id" method="POST" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Nom</label>
                                <input
                                    type="text"
                                    name="Nom"
                                    required
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
                                    className="w-full p-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                    placeholder="Votre prénom"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Société ?</label>
                            <div className="flex gap-6 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Societe" value="Oui" className="text-primary focus:ring-primary" />
                                    <span className="text-gray-600">Oui</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Societe" value="Non" defaultChecked className="text-primary focus:ring-primary" />
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
                                    className="w-full p-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                    placeholder="exemple@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Téléphone</label>
                                <input
                                    type="tel"
                                    name="Tel"
                                    required
                                    className="w-full p-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                    placeholder="0470 12 34 56"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Type d'événement</label>
                                <select
                                    name="Type_Evenement"
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
