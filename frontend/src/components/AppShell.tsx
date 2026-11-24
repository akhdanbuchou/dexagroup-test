"use client";

import {
  ClockCircleOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Layout,
  Menu,
  Typography,
  type MenuProps,
} from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { logout } from "@/actions/auth";
import { BrandMark } from "@/components/BrandMark";
import { ROLE_LABEL } from "@/utils/roles";
import { BRAND } from "@/utils/theme";
import type { TAppShellProps, TNavItem } from "@/types/layout";
import type { TRole } from "@/types/user";

const NAV_ITEMS: Record<TRole, TNavItem[]> = {
  HR_ADMIN: [{ key: "/admin", label: "Employees", icon: <TeamOutlined /> }],
  EMPLOYEE: [
    { key: "/attendance", label: "Clock In / Out", icon: <ClockCircleOutlined /> },
    { key: "/attendance/history", label: "Attendance History", icon: <HistoryOutlined /> },
  ],
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppShell({ user, children }: TAppShellProps) {
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg ?? true;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const items = NAV_ITEMS[user.role];
  const selectedKey =
    [...items]
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))?.key ??
    items[0].key;

  const menuItems: MenuProps["items"] = items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link href={item.key} onClick={() => setDrawerOpen(false)}>
        {item.label}
      </Link>
    ),
  }));

  const userMenu: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      danger: true,
      disabled: loggingOut,
      onClick: () => startLogout(() => logout()),
    },
  ];

  const navigation = (
    <Flex vertical style={{ height: "100%" }}>
      <div style={{ padding: "20px 20px 12px" }}>
        <BrandMark />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ borderInlineEnd: "none", padding: "0 8px" }}
      />
    </Flex>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isDesktop ? (
        <Layout.Sider width={248} style={{ borderInlineEnd: `1px solid ${BRAND.border}` }}>
          {navigation}
        </Layout.Sider>
      ) : (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size={260}
          closable={false}
          styles={{ body: { padding: 0 } }}
        >
          {navigation}
        </Drawer>
      )}
      <Layout>
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isDesktop ? "flex-end" : "space-between",
            padding: "0 16px",
            borderBottom: `1px solid ${BRAND.border}`,
          }}
        >
          {!isDesktop && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
            />
          )}
          <Dropdown menu={{ items: userMenu }} trigger={["click"]} placement="bottomRight">
            <Button type="text" style={{ height: "auto", padding: "4px 8px" }}>
              <Flex align="center" gap={10}>
                <Avatar style={{ background: BRAND.primary }}>{initials(user.name)}</Avatar>
                <Flex vertical align="flex-start" style={{ lineHeight: 1.3 }}>
                  <Typography.Text strong>{user.name}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {ROLE_LABEL[user.role]}
                  </Typography.Text>
                </Flex>
              </Flex>
            </Button>
          </Dropdown>
        </Layout.Header>
        <Layout.Content style={{ padding: isDesktop ? 24 : 16 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
