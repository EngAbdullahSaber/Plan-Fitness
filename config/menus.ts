import {
  Settings,
  Communication,
  Features,
  Notification,
  Finance,
  userss,
  Reservation,
  Property,
  Reports,
  Account,
  Package,
  ChartBar,
  Vendors,
  Dashboard,
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
}

// Define menu configurations for admin and user roles
const adminMenu = [
  { title: "Dashboard", icon: Dashboard, href: "/dashboard" },
  { title: "users", icon: Dashboard, href: "/users" },
  { title: "blogs", icon: Dashboard, href: "/blogs" },
  { title: "meals", icon: Dashboard, href: "/meals" },
  { title: "training", icon: Dashboard, href: "/training" },
];

// Conditional menu configuration based on the role
export const menusConfig = {
  mainNav: [],

  sidebarNav: {
    modern: adminMenu, // Admin menu for admin role, user menu otherwise
    classic: adminMenu, // Same logic for classic menu
    module: adminMenu, // Same logic for classic menu
  },
};

// Types based on menu structure
export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
