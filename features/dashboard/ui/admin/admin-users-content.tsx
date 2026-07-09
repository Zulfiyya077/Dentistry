"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import {
  adminService,
  type AdminUser,
  type UserAccountStatus,
} from "@/features/dashboard/services/admin.service";
import { useTranslation } from "@/providers/locale-provider";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/lib/toast";
import { UserRole } from "@/types/enums";
import type { TranslationKey } from "@/lib/i18n";

const roleBadgeVariant: Record<
  UserRole,
  "default" | "verified" | "document" | "outline" | "secondary"
> = {
  [UserRole.GUEST]: "outline",
  [UserRole.PATIENT]: "default",
  [UserRole.DOCTOR]: "secondary",
  [UserRole.ADMIN]: "verified",
};

const roleLabelKey: Record<UserRole, TranslationKey> = {
  [UserRole.GUEST]: "dashboard.admin.roles.guest",
  [UserRole.PATIENT]: "dashboard.admin.roles.patient",
  [UserRole.DOCTOR]: "dashboard.admin.roles.doctor",
  [UserRole.ADMIN]: "dashboard.admin.roles.admin",
};

export function AdminUsersContent() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setUsers(adminService.getAllUsers());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch =
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const handleStatusToggle = (user: AdminUser) => {
    if (user.role === UserRole.ADMIN) {
      showToast(t("dashboard.admin.users.cannotSuspendAdmin"), "info");
      return;
    }

    const nextStatus: UserAccountStatus =
      user.status === "active" ? "suspended" : "active";
    adminService.setUserStatus(user.id, nextStatus);
    refresh();
    showToast(
      nextStatus === "suspended"
        ? t("dashboard.admin.users.suspended")
        : t("dashboard.admin.users.activated"),
      "success"
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("dashboard.admin.users.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.admin.users.subtitle")}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.admin.users.total", { count: filteredUsers.length })}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.admin.users.search")}
            className="auth-input w-full pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as UserRole | "all")
          }
          className="filter-select"
        >
          <option value="all">{t("dashboard.admin.users.allRoles")}</option>
          <option value={UserRole.PATIENT}>
            {t("dashboard.admin.roles.patient")}
          </option>
          <option value={UserRole.DOCTOR}>
            {t("dashboard.admin.roles.doctor")}
          </option>
          <option value={UserRole.ADMIN}>
            {t("dashboard.admin.roles.admin")}
          </option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-4 font-medium">
                  {t("dashboard.admin.users.name")}
                </th>
                <th className="px-5 py-4 font-medium">
                  {t("dashboard.admin.users.email")}
                </th>
                <th className="px-5 py-4 font-medium">
                  {t("dashboard.admin.users.role")}
                </th>
                <th className="px-5 py-4 font-medium">
                  {t("dashboard.admin.users.status")}
                </th>
                <th className="px-5 py-4 font-medium">
                  {t("dashboard.admin.users.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    {t("dashboard.admin.users.empty")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">{user.displayName}</div>
                      {user.isDemo && (
                        <span className="text-xs text-muted-foreground">
                          {t("dashboard.admin.users.demo")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={roleBadgeVariant[user.role]}>
                        {t(roleLabelKey[user.role])}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          user.status === "active" ? "verified" : "outline"
                        }
                      >
                        {user.status === "active"
                          ? t("dashboard.admin.users.active")
                          : t("dashboard.admin.users.suspendedLabel")}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        size="sm"
                        variant={
                          user.status === "active" ? "outline" : "secondary"
                        }
                        onClick={() => handleStatusToggle(user)}
                        disabled={user.role === UserRole.ADMIN}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="mr-1.5 h-3.5 w-3.5" />
                            {t("dashboard.admin.users.suspend")}
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                            {t("dashboard.admin.users.activate")}
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
