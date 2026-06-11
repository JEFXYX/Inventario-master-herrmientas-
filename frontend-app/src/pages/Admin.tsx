import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
    { path: "/admin/productos", icon: "inventory_2", label: "Products" },
    { path: "/admin/categorias", icon: "category", label: "Categories" },
    { path: "/admin/clientes", icon: "group", label: "Customers" },
    { path: "/admin/ventas", icon: "payments", label: "Sales" },
  ];

  return (
    <div className="font-body-md text-on-background bg-background min-h-screen flex">
      {/* SideNavBar Component */}
      <aside className="fixed left-0 top-0 h-full w-[280px] z-40 bg-inverse-surface dark:bg-surface-container-lowest flex flex-col shadow-xl">
        {/* Brand Header */}
        <div className="px-lg py-xl flex flex-col gap-sm">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
            </div>
            <h1 className="text-headline-md font-headline-md text-inverse-on-surface dark:text-on-surface">Admin Console</h1>
          </div>
          <p className="text-label-md font-label-md text-secondary-fixed-dim px-xs">Technical Operations</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-md sidebar-scroll overflow-y-auto space-y-sm">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.path 
              : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-md px-lg py-md rounded-lg transition-all active:scale-[0.98] ${
                  isActive
                    ? "bg-primary-container text-on-primary-container border-l-4 border-primary rounded-l-none"
                    : "text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label-md text-label-md">{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-lg pb-sm px-lg">
            <button className="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md flex items-center justify-center gap-sm hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined">add</span>
              New Asset
            </button>
          </div>
        </nav>

        {/* Footer Links */}
        <div className="mt-auto px-md py-lg border-t border-on-secondary-fixed-variant">
          <button onClick={handleLogout} className="w-full flex items-center gap-md text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant px-lg py-md rounded-lg transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Cerrar Sesión</span>
          </button>
          <a href="#" className="flex items-center gap-md text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant px-lg py-md rounded-lg transition-all">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </a>
          <a href="#" className="flex items-center gap-md text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant px-lg py-md rounded-lg transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-[280px] min-h-screen flex flex-col">
        {/* TopAppBar Component */}
        <header className="sticky top-0 z-30 bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline">
          <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
            <div className="flex items-center gap-xl flex-1">
              <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">ToolMaster Pro</span>
              <div className="relative w-full max-w-md hidden md:block">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Search operations..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-lg">
              <div className="hidden lg:flex gap-lg items-center">
                <a className="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Features</a>
                <a className="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Pricing</a>
                <a className="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Documentation</a>
              </div>
              <div className="flex items-center gap-md border-l border-outline-variant pl-lg">
                <button className="material-symbols-outlined p-sm rounded-full text-secondary hover:bg-surface-container-low transition-colors">notifications</button>
                <button className="material-symbols-outlined p-sm rounded-full text-secondary hover:bg-surface-container-low transition-colors">settings</button>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary cursor-pointer transition-colors">
                  <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRJisuStHS1mnGDhS9a4I6V1nPblCfj6deT8UhNgMCxZOKccI1KDxkyz5Vbzpbk-Wr0gNa8H28iqT_frw0qFSE3mbHQf6ODh04vPWpMBqZImlriFevQw2U0l-8EZAqdSkGATpHKzSpORxQCaF5kiCzsRvPo5Ipj__s-d_HMC5zB2dttt7Dg1Y8C8gWF457nN_B-InyHgdreh7ykiwEY_DqROddVMLiQDISD3ol_dcMo9Qmo53OoQLLyWKo2fibZa7wy2up6gQ78uc" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet for Nested Routes (Dashboard, Products, etc.) */}
        <div className="flex-1 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </div>

        {/* Footer Component */}
        <footer className="mt-auto w-full py-xl px-lg bg-surface-container-highest dark:bg-surface-dim border-t border-outline-variant">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-lg">
            <div className="flex flex-col items-center md:items-start gap-xs">
              <p className="text-label-md font-label-md font-bold text-on-surface">ToolMaster Pro Inc.</p>
              <p className="text-body-sm text-on-surface-variant">© 2024 ToolMaster Pro Inc. All professional rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-lg">
              <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" href="#">Privacy Policy</a>
              <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" href="#">Terms of Service</a>
              <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" href="#">API Status</a>
              <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary" href="#">Contact Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
