import type { ReactNode } from "react";
import HomeNavbar from "./HomeNavbar";
import "../styles/home.css";

interface PublicPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PublicPageLayout({ children, className }: PublicPageLayoutProps) {
  return (
    <div className={className ? `home-page ${className}` : "home-page"}>
      <HomeNavbar />
      {children}
    </div>
  );
}
