"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const routes = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/analyze", label: "Code Analysis", icon: "🔍" },
  { path: "/reverse-interview", label: "Mock Interview", icon: "💻" },
  { path: "/progress", label: "Code DNA", icon: "🧬" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <span className={styles.logoIcon}>⛩️</span>
        <h1 className={styles.logoText}>CodeSensei</h1>
      </div>
      
      <nav className={styles.nav}>
        {routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link 
              key={route.path} 
              href={route.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{route.icon}</span>
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>U</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Upcoming Dev</p>
            <p className={styles.userLevel}>Beginner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
