import {
  Settings,
  Meals,
  Features,
  Notification,
  Finance,
  userss,
  Reservation,
  Property,
  Reports,
  Account,
  Blogs,
  ChartBar,
  Exercises,
  Dashboard,
  Products,
  cubicss,
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
  { title: "users", icon: userss, href: "/users" },
  { title: "coach", icon: userss, href: "/coach" },
  { title: "blogs", icon: Blogs, href: "/blogs" },
  { title: "meals", icon: Meals, href: "/meals" },
  {
    title: "Category",
    icon: Products,
    href: "/category",
  },
  { title: "Exercises", icon: Exercises, href: "/exercises" },
  { title: "Subscriptions", icon: cubicss, href: "/subscriptions" },
  { title: "Settings", icon: Settings, href: "/settings" },
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
