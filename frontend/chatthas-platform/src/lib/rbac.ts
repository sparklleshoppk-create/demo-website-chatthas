import { createClient } from '@/utils/supabase/server';

export type AdminRole = 'super_admin' | 'branch_manager' | 'kitchen_staff' | 'delivery_manager' | 'content_manager' | 'support_team';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
}

/**
 * Retrieves the current authenticated admin user from the database.
 * Returns null if not authenticated or not an admin.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // We check both the legacy `admins.role` and the new `admin_roles.role` if needed.
  // For now, based on Phase 1 Schema, we rely on `admin_roles` or the existing `admins` table mapping.
  // Assuming `admins` table holds the core reference.
  const { data: admin } = await supabase
    .from('admins')
    .select('id, user_id, role')
    .eq('user_id', user.id)
    .single();

  return admin as AdminUser | null;
}

/**
 * Checks if the current admin has at least one of the required roles.
 */
export async function hasRole(requiredRoles: AdminRole[]): Promise<boolean> {
  const admin = await getCurrentAdmin();
  if (!admin) return false;
  
  if (admin.role === 'super_admin') return true; // super_admin overrides all checks
  
  return requiredRoles.includes(admin.role);
}

/**
 * Utility to log admin actions to the audit_logs table.
 * Must be called server-side.
 */
export async function logAdminAction(
  action: string, 
  tableName?: string, 
  recordId?: string, 
  oldData?: any, 
  newData?: any
) {
  const admin = await getCurrentAdmin();
  if (!admin) return;

  const supabase = createClient();
  
  await supabase.from('audit_logs').insert({
    admin_id: admin.id,
    action,
    table_name: tableName,
    record_id: recordId,
    old_data: oldData ? JSON.stringify(oldData) : null,
    new_data: newData ? JSON.stringify(newData) : null,
  });
}
