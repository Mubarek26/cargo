
export const getLandingPage = (role: string | null): string => {
  if (!role) return "/login";
  
  const normalizedRole = role.toUpperCase();
  switch (normalizedRole) {
    case "SHIPPER":
      return "/marketplace";
    case "DRIVER":
      return "/driver/trips";
    case "SUPER_ADMIN":
    case "COMPANY_ADMIN":
    case "VENDOR":
      return "/home";
    default:
      return "/home";
  }
};
