let selectedRole: string | null = null;

export const roleStore = {
  get: () => selectedRole,
  set: (role: string) => {
    selectedRole = role;
  },
};

