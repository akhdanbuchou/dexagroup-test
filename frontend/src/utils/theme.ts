import type { ThemeConfig } from "antd";

export const BRAND = {
  primary: "#e5484d",
  primaryDark: "#c53035",
  soft: "#fff1f1",
  softer: "#fff8f8",
  border: "#fbd5d5",
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: BRAND.primary,
    colorLink: BRAND.primary,
    colorInfo: BRAND.primary,
    borderRadius: 10,
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  components: {
    Layout: {
      bodyBg: BRAND.softer,
      headerBg: "#ffffff",
      siderBg: "#ffffff",
    },
    Menu: {
      itemSelectedBg: BRAND.soft,
      itemSelectedColor: BRAND.primaryDark,
      itemHoverBg: BRAND.softer,
      itemBorderRadius: 8,
    },
    Card: {
      colorBorderSecondary: BRAND.border,
    },
    Table: {
      headerBg: BRAND.soft,
    },
  },
};
