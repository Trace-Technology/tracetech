import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              TRACE<span className="text-red-500">TECH</span>
            </Link>
            <p className="text-zinc-400 text-sm mt-1">
              Custom PCB Design for Any Application
            </p>
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <Link href="/work" className="hover:text-white transition-colors">
              Our Work
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
