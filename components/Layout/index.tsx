"use client";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="h-full">{children}</div>
    </div>
  );
}

export default Layout;
