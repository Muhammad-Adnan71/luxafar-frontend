"use client";
import React from "react";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "components/CMS/containers/layout";
import { usePathname } from "next/navigation";
import "@styles/ql.css";

export default function Layout({ children }: { children: any }) {
  const pathname = usePathname();
  const withoutLayoutRoute = ["/admin", "/admin/forgot-password"];

  if (withoutLayoutRoute.includes(pathname)) return children;
  return <AdminLayout>{children}</AdminLayout>;
}
