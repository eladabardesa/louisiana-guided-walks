import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <p className="text-sm tracking-[0.2em] text-gray-900 uppercase mb-4">
              AAE
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Attentive Art Encounters
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
              Navigate
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
              Get in touch
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:eladbardes@gmail.com"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                eladbardes@gmail.com
              </a>
              <a
                href="tel:+4591764091"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                +45 91 76 40 91
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Attentive Art Encounters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
