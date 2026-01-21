export const TARGET_USER_TYPES = [
  { value: 'developers', label: 'Developers' },
  { value: 'designers', label: 'Designers' },
  { value: 'product_managers', label: 'Product Managers' },
  { value: 'founders', label: 'Founders / CEOs' },
  { value: 'executives', label: 'Executives' },
  { value: 'marketing', label: 'Marketing Teams' },
  { value: 'sales', label: 'Sales Teams' },
  { value: 'operations', label: 'Operations' },
  { value: 'end_users', label: 'End Users' },
] as const;

export const COMPANY_SIZES = [
  { value: 'solo', label: 'Solo / Individual' },
  { value: 'startup', label: 'Startup (1-50)' },
  { value: 'smb', label: 'SMB (50-500)' },
  { value: 'enterprise', label: 'Enterprise (500+)' },
] as const;

export const PRODUCT_STAGES = [
  { value: 'IDEA', label: 'Idea stage' },
  { value: 'MVP', label: 'MVP / Beta' },
  { value: 'EARLY_TRACTION', label: 'Early traction' },
  { value: 'GROWTH', label: 'Growth phase' },
  { value: 'SCALE', label: 'Scaling' },
] as const;

export const TOTAL_STEPS = 4;
