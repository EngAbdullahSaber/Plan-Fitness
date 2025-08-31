"use client";
import React, { useState } from "react";

import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import SidebarLogo from "../common/logo";
import { menusConfig } from "@/config/menus";
import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSidebar, useThemeStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, usePathname } from "next/navigation";

const PopoverSidebar = ({ trans }: { trans: string }) => {
  const { collapsed, sidebarBg } = useSidebar();
  const { layout, isRtl } = useThemeStore();
  const menus = menusConfig?.sidebarNav?.classic || [];
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);
  const { lang } = useParams();
  const toggleSubmenu = (i: number) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex: number) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  React.useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus?.map((item: any, i: number) => {
      if (item?.child) {
        item.child.map((childItem: any, j: number) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.map((multiItem: any, k: number) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName]);

  // menu title

  return (
    <div
      className={cn(
        "fixed top-0 h-full border-r bg-gradient-to-b from-[#25235F] via-blue-800 to-[#25235F] shadow-xl transition-all duration-300",
        {
          "w-[210px]": !collapsed,
          "w-[72px]": collapsed,
          "m-6 bottom-0 rounded-xl": layout === "semibox",
        }
      )}
    >
      {/* Gradient overlay - more subtle than the image background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#403cb6] to-[#25235F]/20 z-0"></div>

      {/* Optional texture - comment out if not needed */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>

      <div className="relative z-10">
        <SidebarLogo />
        <Separator className="bg-white/10" />

        <ScrollArea
          className={cn("sidebar-menu h-[calc(100%-80px)]", {
            "ps-2": !collapsed,
          })}
        >
          <ul
            dir={lang == "ar" ? "rtl" : "ltr"}
            className={cn("space-y-1 ps-2", {
              "space-y-2": collapsed,
            })}
          >
            {menus.map((item, i) => (
              <li key={`menu_key_${i}`} className="relative">
                {/* single menu */}
                {!item.child && !item.isHeader && (
                  <SingleMenuItem
                    item={item}
                    collapsed={collapsed}
                    trans={trans}
                  />
                )}

                {/* menu label */}
                {item.isHeader && !item.child && !collapsed && (
                  <MenuLabel item={item} trans={trans} />
                )}

                {/* sub menu */}
                {item.child && (
                  <>
                    <SubMenuHandler
                      item={item}
                      toggleSubmenu={toggleSubmenu}
                      index={i}
                      activeSubmenu={activeSubmenu}
                      collapsed={collapsed}
                      menuTitle={item.title}
                      trans={trans}
                    />
                    {!collapsed && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenu}
                        item={item}
                        index={i}
                        trans={trans}
                      />
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PopoverSidebar;
