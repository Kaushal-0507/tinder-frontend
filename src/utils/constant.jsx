export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:7000" : "/api";
export const DEFAULT_USER_IMG =
  "https://tse4.mm.bing.net/th/id/OIP.TctatNGs7RN-Dfc3NZf91AAAAA?pid=Api&P=0&h=180";

export const getMembershipGradient = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent";
    case "gold":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent";
    case "platinum":
      return "bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent";
    default:
      return "bg-gradient-to-r from-emerald-400 to-gray-600 bg-clip-text text-transparent";
  }
};

export const getMembershipGradientBG = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "bg-gradient-to-r from-gray-400 to-gray-600 ";
    case "gold":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 ";
    case "platinum":
      return "bg-gradient-to-r from-emerald-600 to-blue-500";
    default:
      return "bg-gradient-to-r from-emerald-400 to-gray-600 ";
  }
};

export const getMembershipBorder = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "border-gray-400";
    case "gold":
      return "border-yellow-400";
    case "platinum":
      return "border-emerald-400";
    default:
      return "border-emerald-400";
  }
};

export const getMembershipSVGColor = (membershipType) => {
  switch (membershipType?.toLowerCase()) {
    case "silver":
      return "text-gray-400";
    case "gold":
      return "text-yellow-400";
    case "platinum":
      return "text-emerald-400";
    default:
      return "text-emerald-400";
  }
};
