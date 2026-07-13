import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useEffect } from "react";
import { LayoutDashboard, FileText, CheckSquare, FileKey, BookOpen, Database, Inbox, LogOut, ShieldCheck } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("tera_exam_admin_token") : null;
  const { data: admin, isError, isLoading } = useGetMe({
    query: {
      enabled: Boolean(token),
      retry: false,
      queryKey: getGetMeQueryKey(),
    },
  });

  useEffect(() => {
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    if (isError) {
      localStorage.removeItem("tera_exam_admin_token");
      setLocation("/admin/login");
    }
  }, [token, isError, setLocation]);

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center bg-background px-4"><div className="rounded-xl border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div><h2 className="text-lg font-semibold">Secure admin access</h2><p className="mt-2 text-sm text-muted-foreground">You’ll be redirected to the login screen shortly.</p></div></div>;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background px-4"><div className="rounded-xl border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6 animate-pulse" /></div><h2 className="text-lg font-semibold">Checking access</h2><p className="mt-2 text-sm text-muted-foreground">Validating your admin session...</p></div></div>;
  }

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center bg-background px-4"><div className="rounded-xl border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div><h2 className="text-lg font-semibold">Session expired</h2><p className="mt-2 text-sm text-muted-foreground">Please log in again to continue.</p></div></div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('tera_exam_admin_token');
    setLocation('/admin/login');
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/scraped-items", label: "Review Queue", icon: Inbox },
    { href: "/admin/jobs", label: "Jobs", icon: FileText },
    { href: "/admin/results", label: "Results", icon: CheckSquare },
    { href: "/admin/admit-cards", label: "Admit Cards", icon: FileKey },
    { href: "/admin/syllabus", label: "Syllabus", icon: BookOpen },
    { href: "/admin/exam-prep", label: "Exam Prep", icon: Database },
  ];

  return (
    <div className="min-h-screen flex font-sans bg-muted/20">
      <aside className="w-64 border-r bg-background flex flex-col flex-shrink-0 fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="font-serif font-bold text-xl tracking-tighter text-primary">
            TERA EXAM <span className="text-muted-foreground text-sm font-sans font-normal ml-2">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{admin.username}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
