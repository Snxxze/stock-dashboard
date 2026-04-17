import {
  Home,
  LayoutDashboard,
  Wallet,
  Newspaper,
  TrendingUp,
  Settings,
  Phone,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home,            label: "Home",       active: false },
  { icon: LayoutDashboard, label: "Dashboard",  active: true  },
  { icon: Wallet,          label: "Wallet",     active: false },
  { icon: Newspaper,       label: "News",       active: false },
  { icon: TrendingUp,      label: "Stocks",     active: false },
];

export function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col p-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <span className="font-bold text-lg">Stock Dash</span>
      </div>

      {/* Total Investment Card mock ไว้ก่อน*/}
      <div className="bg-black text-white rounded-2xl p-4 mb-8">
        <p className="text-xs text-gray-400 mb-1">Total Investment</p>
        <p className="text-xl font-bold">$5,380.90</p>
        <p className="text-green-400 text-sm mt-1">+18.10% ↑</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-sm">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              active
                ? "bg-gray-100 font-medium text-black"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </nav>

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1 text-sm mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Users size={16} /> Community
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Settings size={16} /> Settings
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-50">
          <Phone size={16} /> Contact
        </a>
      </nav>
    </aside>
  );
}
