// Role-Based Access Control Configuration

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const PERMISSIONS = {
  // Resource permissions
  READ_USERS: 'read:users',
  WRITE_USERS: 'write:users',
  DELETE_USERS: 'delete:users',
  
  READ_DATA: 'read:data',
  WRITE_DATA: 'write:data',
  DELETE_DATA: 'delete:data',
  
  READ_REPORTS: 'read:reports',
  WRITE_REPORTS: 'write:reports'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.READ_USERS,
    PERMISSIONS.WRITE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.READ_DATA,
    PERMISSIONS.WRITE_DATA,
    PERMISSIONS.DELETE_DATA,
    PERMISSIONS.READ_REPORTS,
    PERMISSIONS.WRITE_REPORTS
  ],
  [ROLES.USER]: [
    PERMISSIONS.READ_DATA,
    PERMISSIONS.WRITE_DATA,
    PERMISSIONS.READ_REPORTS
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.READ_DATA
  ]
};

function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions
};
