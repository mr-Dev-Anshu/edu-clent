import { useCallback, useMemo } from "react";
import { useAppSelector } from "./useStore"; 
import {
    selectPermissions,
    selectAuthUser,
    selectIsSuperAdmin,
} from "@/features/auth/slice";

export function usePermission() {
    const user = useAppSelector(selectAuthUser);
    const permissions = useAppSelector(selectPermissions);
    const isSuperAdmin = useAppSelector(selectIsSuperAdmin);

    const roleType = useMemo(() => user?.roles[0]?.roleType || null, [user]);

    /**
     * Check a single permission slug.
     * @example can('create:students')
     */
    const can = useCallback(
        (slug: string): boolean => {
            if (isSuperAdmin) return true;
            return permissions.includes(slug);
        },
        [permissions, isSuperAdmin],
    );

    /**
     * True if the user has AT LEAST ONE of the given slugs.
     */
    const canAny = useCallback(
        (slugs: string[]): boolean => {
            if (isSuperAdmin) return true;
            return slugs.some((slug) => permissions.includes(slug));
        },
        [permissions, isSuperAdmin],
    );

    /**
     * True if the user has ALL of the given slugs.
     */
    const canAll = useCallback(
        (slugs: string[]): boolean => {
            if (isSuperAdmin) return true;
            return slugs.every((slug) => permissions.includes(slug));
        },
        [permissions, isSuperAdmin],
    );

    /**
     * Check role type directly.
     * supports: isRole('staff') or isRole(['admin', 'staff'])
     */
    const isRole = useCallback(
        (role: string | string[]): boolean => {
            if (!roleType) return false;
            return Array.isArray(role) ? role.includes(roleType) : roleType === role;
        },
        [roleType],
    );

    return {
        can,
        canAny,
        canAll,
        isRole,
        roleType,
        isSuperAdmin,
    };
}
