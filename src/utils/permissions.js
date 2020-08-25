export function hasPermission(user, permission) {
  if (!permission || !user) {
    return true;
  }
  const isAllowed = user.is_superuser || user.permissions.includes(permission);
  return isAllowed;
}
