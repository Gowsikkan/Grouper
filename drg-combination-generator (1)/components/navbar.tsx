import type React from "react"
import Link from "next/link"
import { Activity, FileText, Settings, HelpCircle } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-gradient-to-r from-orange-600 to-orange-200 shadow-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-white" />
          <span className="flex items-center text-xl font-bold text-white">DRG Analyzer</span>
        </div>
{/* 
        <div className="hidden md:flex items-center space-x-6">
          <NavItem href="#" icon={<FileText className="h-4 w-4 mr-1" />} label="Cases" />
          <NavItem href="#" icon={<Settings className="h-4 w-4 mr-1" />} label="Settings" />
          <NavItem href="#" icon={<HelpCircle className="h-4 w-4 mr-1" />} label="Help" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
            JD
          </div>
        </div> */}
      </div>
    </nav>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center text-white/90 hover:text-white transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  )
}

