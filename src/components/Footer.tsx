import { Instagram, Mail, Phone, MapPin, Facebook } from "lucide-react";
import { useContactInfo } from "../hooks/useFirebaseData";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Fetch contact info from Firebase
  const { contactInfo } = useContactInfo();

  // Use Firebase data or fallback
  const CONTACT_INFO = contactInfo || {
    phone: { display: "+54 9 11 1234-5678" },
    email: { primary: "info@lombok.com" },
    address: { city: "Buenos Aires", province: "Argentina" },
    social: { instagram: "#", tiktok: "#" },
  };

  const quickLinks = [
    { name: "Nosotros", href: "#about" },
    { name: "Galería", href: "#gallery" },
    { name: "Precios", href: "#pricing" },
    { name: "Reseñas", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
    { name: "Contacto", href: "#contact" },
    { name: "Privacidad", href: "/privacidad" },
  ];

  const adventures = [
    { name: "Viajes de Snowboard", href: "/snowboard" },
    { name: "Clases de Surf", href: "/surf" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href:
        contactInfo?.social?.instagram || CONTACT_INFO.social?.instagram || "#",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: contactInfo?.social?.tiktok || CONTACT_INFO.social?.tiktok || "#",
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white px-4 text-xs">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="/assets/lombok-full-row.png"
                  alt="Lombok"
                  className="h-10 w-auto filter invert brightness-0 contrast-100"
                />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Creando aventuras inolvidables de snowboard y surf desde 2014.
                Únete a nosotros para la aventura de tu vida.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Adventures */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Aventuras</h3>
              <ul className="space-y-3">
                {adventures.map((adventure, index) => (
                  <li key={index}>
                    <a
                      href={adventure.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      {adventure.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="h-5 w-5 text-primary-400" />
              <span className="text-gray-300">
                {CONTACT_INFO.phone.display}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-5 w-5 text-primary-400" />
              <span className="text-gray-300">
                {CONTACT_INFO.email.primary}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="h-5 w-5 text-primary-400" />
              <span className="text-gray-300">
                {CONTACT_INFO.address.city}, {CONTACT_INFO.address.province}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <div className="flex gap-4">
                <div>© {currentYear} Lombok</div>
                <div>Todos los derechos reservados.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
