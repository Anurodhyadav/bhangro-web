import { Music2, MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./icons/BrandIcons";

export default function SocialLocation() {
  return (
    <section id="connect" className="bg-hemp-900 text-cream py-20">
      <div className="mx-auto max-w-6xl px-6 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl font-semibold">Follow Along</h3>
          <p className="mt-2 text-hemp-100/80 text-sm">
            New drops, behind-the-scenes and restocks go up here first.
          </p>
          <div className="mt-5 space-y-3">
            <a href="https://www.instagram.com/bhangro__/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-rust-400 transition">
              <InstagramIcon size={20} /> @bhangro__
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-rust-400 transition">
              <FacebookIcon size={20} /> Bhangro {/* TODO: link your Facebook page */}
            </a>
            <a href="#" className="flex items-center gap-3 hover:text-rust-400 transition">
              <Music2 size={20} /> TikTok {/* TODO: link your TikTok, if you have one */}
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold">Visit Us</h3>
          <div className="mt-5 space-y-3 text-hemp-100/80 text-sm">
            <p className="flex items-start gap-3">
              <MapPin size={20} className="shrink-0 text-rust-400" />
              {/* TODO: replace with your exact shop address */}
              Kathmandu, Nepal
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold">Get in Touch</h3>
          <div className="mt-5 space-y-3 text-hemp-100/80 text-sm">
            <a href="tel:+977XXXXXXXXXX" className="flex items-center gap-3 hover:text-rust-400 transition">
              <Phone size={20} className="text-rust-400" />
              {/* TODO: replace with your real phone / WhatsApp number */}
              +977 XX-XXXXXXX
            </a>
            <a href="mailto:hello@bhangro.com" className="flex items-center gap-3 hover:text-rust-400 transition">
              <Mail size={20} className="text-rust-400" />
              hello@bhangro.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}