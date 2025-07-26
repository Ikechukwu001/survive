import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-4">Survive with 10k</h3>
          <p className="text-sm text-gray-400">
            A creative challenge platform for young hustlers and smart minds in Naija. Learn, grow, win.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Challenges</a></li>
            <li><a href="#" className="hover:underline">Leaderboard</a></li>
            <li><a href="#" className="hover:underline">Testimonials</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@survive10k.ng" className="hover:underline">info@survive10k.ng</a></li>
            <li>WhatsApp: <a href="https://wa.me/2348123456789" className="hover:underline">+234 812 345 6789</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-600"><Facebook size={20} /></a>
            <a href="mailto:info@survive10k.ng" className="hover:text-yellow-300"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Survive with 10k. All rights reserved.
      </div>
    </footer>
  );
}
