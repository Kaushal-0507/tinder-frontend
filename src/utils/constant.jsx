export const BASE_URL = import.meta.env.VITE_API_URL;

export const DEFAULT_USER_IMG =
  "https://tse4.mm.bing.net/th/id/OIP.TctatNGs7RN-Dfc3NZf91AAAAA?pid=Api&P=0&h=180";

export const APP_BG =
  "https://i.pinimg.com/1200x/6c/22/df/6c22dfb37a9d4f04b2700c94c1eee626.jpg";

export const getMembershipGradient = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent";
    case "gold":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent";
    case "platinum":
      return "bg-gradient-to-r from-teal-400 via-emerald-300 to-zinc-100 bg-clip-text text-transparent";
    default:
      return "bg-gradient-to-r from-emerald-400 to-gray-600 bg-clip-text text-transparent";
  }
};

export const getMembershipGradientBG = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "bg-gradient-to-r from-gray-400 to-gray-600";
    case "gold":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case "platinum":
      return "bg-gradient-to-r from-teal-400 via-emerald-300 to-zinc-100";
    default:
      return "bg-gradient-to-r from-emerald-400 to-gray-600";
  }
};

export const getMembershipBorder = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "border-gray-400";
    case "gold":
      return "border-yellow-400";
    case "platinum":
      return "border-teal-400";
    default:
      return "border-emerald-400";
  }
};

export const getMembershipRing = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "focus:ring-gray-400";
    case "gold":
      return "focus:ring-yellow-400";
    case "platinum":
      return "focus:ring-teal-400";
    default:
      return "focus:ring-gray-400";
  }
};

export const getMembershipSVGColor = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "text-gray-400";
    case "gold":
      return "text-yellow-400";
    case "platinum":
      return "text-teal-400";
    default:
      return "text-emerald-400";
  }
};
