"use client";

import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Browse Events" },
  { href: "/categories", label: "Categories" },
  { href: "/register", label: "Sign Up" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">EventHub</h3>
            <p className="text-sm leading-relaxed">
              Discover and join amazing events in your city. From workshops and
              concerts to community drives — find what excites you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@eventhub.com" className="hover:text-white transition-colors">
                  info@eventhub.com
                </a>
              </li>
              <li>Lahore, Pakistan</li>
            </ul>
            {/* Social icons placeholder */}
            <div className="flex gap-4 mt-4">
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 cursor-pointer transition-colors">
                f
              </span>
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 cursor-pointer transition-colors">
                tw
              </span>
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-600 cursor-pointer transition-colors">
                ig
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EventHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
