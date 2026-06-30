'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, MapPin, Map, ClipboardEdit, BarChart3, Stethoscope, Building2,
  ChevronRight, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU = [
  { href: '/',               label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/locacao',        label: 'Locação de Médicos',  icon: MapPin },
  { href: '/mapa',           label: 'Mapa de Salas',       icon: Map },
  { href: '/mapa-manual',    label: 'Mapa Manual',         icon: ClipboardEdit },
  { href: '/produtividade',  label: 'Produtividade',       icon: BarChart3 },
  { href: '/medicos',        label: 'Médicos',             icon: Stethoscope },
  { href: '/unidades',       label: 'Unidades',            icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Gestão</p>
          <p className="text-xs text-slate-400">Ambulatorial</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-400">Sistema on-line</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">13 unidades monitoradas</p>
      </div>
    </aside>
  );
}
