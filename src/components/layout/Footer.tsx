import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Heart } from "lucide-react";
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import okouLogo from "@/assets/okou-background.png";

export function Footer() {
  return (
    <footer className="border-t bg-sidebar text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                <img 
                  src={okouLogo} 
                  alt="OkouSmart Hub" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-bold text-xl text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-white/80">
              Votre partenaire intelligent pour tous vos services professionnels. 
              Rédaction, voyage, emploi, formation et plus encore.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Créé avec passion en Côte d'Ivoire</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Nos Services</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/services/redaction" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Rédaction Académique
                </Link>
              </li>
              <li>
                <Link to="/services/inscription-vap-vae" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Inscription VAP/VAE
                </Link>
              </li>
              <li>
                <Link to="/services/assistance-voyage" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Assistance Voyage
                </Link>
              </li>
              <li>
                <Link to="/services/cv-lettre" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  CV & Lettre de Motivation
                </Link>
              </li>
              <li>
                <Link to="/services/comptabilite" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Gestion Comptabilité
                </Link>
              </li>
              <li>
                <Link to="/services/analyse-financiere" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Analyse Financière
                </Link>
              </li>
              <li>
                <Link to="/services/conception-site-web" className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Conception de site web
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-primary transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Suivez-nous</h3>
            <div className="flex space-x-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent hover:gradient-primary transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent hover:gradient-secondary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent hover:gradient-primary transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent hover:gradient-accent transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-white/10">
              <p className="text-xs text-white/80">
                <span className="text-amber-400 font-semibold">🤖 Assistant IA</span> disponible 24/7 
                pour vous guider dans vos démarches.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
