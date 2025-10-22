import { Mail, Phone, Instagram, Facebook, Twitter, Github } from "lucide-react";

export default function FooterB4Login() {
  return (
    <footer className="bg-primary text-white relative z-10">
      {/* Top Section */}
      <div
        className="
          max-w-7xl mx-auto px-6 py-10 
          grid grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-5 
          gap-8
        "
      >
        {/* Logo + About */}
        <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo/logopng.png"
            alt="TaskFLow Logo"
            className="h-10 sm:h-12 object-contain"
          />
          </div>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            Streamline tasks, track progress, and get things done.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg mb-3">Features</h2>
          <ul className="space-y-2 text-gray-200 text-sm sm:text-base">
            <li>Workspace</li>
            <li>Dashboard</li>
            <li>Task Assignment</li>
            <li>Chatbot</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg mb-3">Contact Us</h2>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            135 Kampuchea Krom, Teuk Thla, Toul Kork, Phnom Penh
          </p>
          <div className="flex items-center gap-2 mt-3 text-sm sm:text-base">
            <Mail size={18} /> <span>Taskflow12@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm sm:text-base">
            <Phone size={18} /> <span>+855 12345678</span>
          </div>
        </div>

        {/* Sponsor */}
        <div className="flex flex-col items-center justify-center md:col-span-3 lg:col-span-1">
          <p className="mb-3 text-center text-sm sm:text-base">
            Sponsor and Organize by
          </p>
          <img
            src="/assets/logo/istad-logo-white.png"
            alt="ISTAD Logo"
            className="h-16 sm:h-20"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-400 mt-4">
        <div
          className="
            max-w-7xl mx-auto px-6 py-4 
            flex flex-col sm:flex-col md:flex-row 
            justify-between items-center 
            gap-4 text-center md:text-left
          "
        >
          <p className="text-gray-300 text-sm sm:text-base">
            © 2025 TaskFlow. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm sm:text-base">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookies</a>
          </div>

          <div className="flex justify-center md:justify-end gap-3 sm:gap-4">
            <a href="#" className="border rounded-full p-2 hover:bg-white/10">
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/share/p/19qVgAV2Vm/" className="border rounded-full p-2 hover:bg-white/10">
              <Facebook size={18} />
            </a>
            <a href="#" className="border rounded-full p-2 hover:bg-white/10">
              <Twitter size={18} />
            </a>
            <a href="#" className="border rounded-full p-2 hover:bg-white/10">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
