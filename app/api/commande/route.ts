import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MENU_DATA } from '../../data/plats-prepares';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy if missing to prevent crash on init

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const {
            Nom, Prenom, Mail, Tel, Societe, Nom_Societe, Date,
            selectedPlat, selectedPotage, quantite,
            semaine, jour, details_projet, captchaToken
        } = data;

        // 1. Validation de base
        if (!Nom || !Prenom || !Mail || !Tel || !semaine || !jour) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        // 1.5 Validation reCAPTCHA côté serveur
        if (!captchaToken) {
            return NextResponse.json({ success: false, error: 'Captcha manquant' }, { status: 400 });
        }

        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (!recaptchaSecret) {
            console.error("RECAPTCHA_SECRET_KEY manquant dans l'environnement");
            return NextResponse.json({ success: false, error: 'Erreur de configuration serveur' }, { status: 500 });
        }

        const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${recaptchaSecret}&response=${captchaToken}`
        });

        const recaptchaData = await verifyRes.json();
        if (!recaptchaData.success) {
            console.error("Erreur validation reCAPTCHA:", recaptchaData);
            return NextResponse.json({ success: false, error: 'Validation Captcha échouée' }, { status: 400 });
        }

        // 2. Sécurité : Recalculer le prix côté serveur pour éviter la manipulation
        const weekData = MENU_DATA.find(m => m.id === semaine);
        const dayData = weekData?.days.find(d => d.day.toLowerCase() === jour.toLowerCase());

        if (!weekData || !dayData) {
            return NextResponse.json({ success: false, error: 'Plat non trouvé' }, { status: 400 });
        }

        const pricePlat = parseFloat(dayData.price.replace(',', '.').replace(' €', ''));
        const pricePotage = selectedPotage && selectedPotage !== "Non merci" ? 4 : 0;
        const parsedQty = parseInt(quantite, 10) || 1;
        const finalTotalPrice = (pricePlat + pricePotage) * parsedQty;

        // Informations bancaires pour le client (À configurer avec les vraies données)
        const IBAN = process.env.TRAITEUR_IBAN || "[À COMPLÉTER PAR LE TRAITEUR]";
        const BIC = process.env.TRAITEUR_BIC || "[À COMPLÉTER PAR LE TRAITEUR]";
        const BENEFICIAIRE = process.env.TRAITEUR_BENEFICIAIRE || "Traiteur Compère";
        const COMMUNICATION = `COMMANDE # ${Nom.toUpperCase()} ${Prenom.toUpperCase()}`;

        // 3. Préparation et envoi des emails via Resend
        // On n'envoie réellement que si une clé API valide est présente (pas la clé dummy)
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) {
            try {
                // Email au Traiteur
                await resend.emails.send({
                    from: 'Traiteur Compère <commande@traiteur-compere.be>', // Modifiez avec votre domaine vérifié si disponible (ex: commandes@traiteurcompere.be)
                    to: process.env.CONTACT_EMAIL || 'traiteurcompere@gmail.com', // Mettre l'email du traiteur ici
                    subject: `[COMMANDE PLATS] ${Nom} ${Prenom} - ${Date}`,
                    html: `
                        <h2>Nouvelle commande de Plat Préparé</h2>
                        <p><strong>Client :</strong> ${Nom} ${Prenom}</p>
                        <p><strong>Email :</strong> ${Mail}</p>
                        <p><strong>Téléphone :</strong> ${Tel}</p>
                        <p><strong>Société :</strong> ${Societe === 'Oui' ? Nom_Societe : 'Non'}</p>
                        <p><strong>Date demandée :</strong> ${Date}</p>
                        <hr />
                        <h3>Détails de la commande</h3>
                        <p><strong>Plat sélectionné :</strong> ${dayData.meal} (${dayData.day} - ${weekData.week})</p>
                        <p><strong>Potage :</strong> ${selectedPotage}</p>
                        <p><strong>Quantité :</strong> ${parsedQty}</p>
                        <p><strong>Total à payer :</strong> ${finalTotalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</p>
                        <hr />
                        <p><strong>Commentaires supplémentaires :</strong><br/>${details_projet || 'Aucun'}</p>
                    `
                });

                // Email au Client
                await resend.emails.send({
                    from: 'Traiteur Compère <commande@traiteur-compere.be>', // Modifiez avec votre domaine vérifié
                    to: Mail,
                    subject: `Confirmation de votre commande - Traiteur Compère`,
                    html: `
                        <h2>Merci pour votre commande, ${Prenom} !</h2>
                        <p>Votre demande a bien été enregistrée. Voici le récapitulatif de votre commande :</p>
                        <ul>
                            <li><strong>Plat :</strong> ${dayData.meal}</li>
                            <li><strong>Potage :</strong> ${selectedPotage}</li>
                            <li><strong>Quantité :</strong> ${parsedQty}</li>
                            <li><strong>Date :</strong> ${Date}</li>
                        </ul>
                        <p><strong>Montant total à régler : ${finalTotalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €</strong></p>
                        <br/>
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37;">
                            <h3>Informations de paiement</h3>
                            <p>Toute commande doit être passée minimum 4 jours à l'avance et le paiement s'effectue par virement bancaire uniquement.</p>
                            <p><strong>Bénéficiaire :</strong> ${BENEFICIAIRE}</p>
                            <p><strong>IBAN :</strong> ${IBAN}</p>
                            <p><strong>BIC :</strong> ${BIC}</p>
                            <p><strong>Communication :</strong> ${COMMUNICATION}</p>
                        </div>
                        <p>Votre commande sera définitivement confirmée à la réception du paiement.</p>
                        <br/>
                        <p>L'équipe Traiteur Compère</p>
                    `
                });
            } catch (emailError) {
                console.error("Erreur d'envoi d'email Resend :", emailError);
                // On peut décider de ne pas bloquer le flux client si l'email échoue, ou alors on renvoie une erreur
            }
        } else {
            console.log("Mode dev ou pas de clé Resend : Emails non envoyés. Voici ce qui aurait été envoyé :");
            console.log(`Prix calculé : ${finalTotalPrice}€ | Client: ${Mail}`);
        }

        return NextResponse.json({
            success: true,
            totalPrice: finalTotalPrice,
            message: 'Commande enregistrée avec succès'
        });

    } catch (error) {
        console.error("Erreur lors de la création de la commande :", error);
        return NextResponse.json({ success: false, error: 'Erreur Serveur' }, { status: 500 });
    }
}

