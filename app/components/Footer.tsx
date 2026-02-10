import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-neutral-400 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Identity */}
                    <div className="flex flex-col items-start gap-6">
                        <div className="text-white">
                            <Logo className="h-20 w-auto text-white" />
                        </div>
                        <p className="text-sm leading-relaxed font-light">
                            L&apos;art de recevoir avec passion. <br />
                            Votre traiteur d&apos;excellence.
                        </p>
                    </div>

                    {/* Column 2: Contact */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-serif text-white text-lg tracking-widest uppercase">Nous Contacter</h3>
                        <div className="flex flex-col gap-4 text-sm">
                            <a href="tel:+32476865407" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors duration-300 group">
                                <PhoneIcon className="w-5 h-5 text-[#D4AF37]" />
                                <span className="group-hover:translate-x-1 transition-transform duration-300">+32 476 86 54 07</span>
                            </a>
                            <a href="mailto:comperejeanpaul@gmail.com" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors duration-300 group">
                                <MailIcon className="w-5 h-5 text-[#D4AF37]" />
                                <span className="group-hover:translate-x-1 transition-transform duration-300">comperejeanpaul@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <MapPinIcon className="w-5 h-5 text-[#D4AF37]" />
                                <span>Région de Liège & Seraing</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Navigation */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-serif text-white text-lg tracking-widest uppercase">Navigation</h3>
                        <div className="flex flex-col gap-3 text-sm">
                            <FooterLink href="/" label="Accueil" />
                            <FooterLink href="/services" label="Services" />
                            {/* Assuming Realizations is part of services or a future page, keeping link active or generic for now */}
                            <FooterLink href="/services" label="Réalisations" />
                            <FooterLink href="/contact" label="Contact" />
                        </div>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-serif text-white text-lg tracking-widest uppercase">Informations</h3>
                        <div className="flex flex-col gap-3 text-sm">
                            <FooterLink href="#" label="Mentions Légales" />
                            <FooterLink href="#" label="Politique de Confidentialité" />
                            <FooterLink href="#" label="CGV" />
                            <FooterLink href="#" label="Gestion des Cookies" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-light">
                        &copy; 2024 Traiteur Compère. Tous droits réservés.
                    </p>
                    <div className="flex gap-6">
                        <SocialLink
                            href="https://www.facebook.com/profile.php?id=61582940090708"
                            icon={<FacebookIcon />}
                        />
                        <SocialLink
                            href="https://www.instagram.com/traiteurcompere8/"
                            icon={<InstagramIcon />}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- Sub-components ---

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-1 inline-block"
        >
            {label}
        </Link>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#D4AF37] transition-transform duration-300 hover:scale-110"
        >
            {icon}
        </a>
    );
}

// --- Icons ---

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7z" />
        </svg>
    );
}

function MailIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    );
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    );
}
