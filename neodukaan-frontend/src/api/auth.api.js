import API from "./axiosInstance";

// Register API Call
export const registerShop = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

// 🚀 NAYA: OTP Bhejne ki API
export const sendLoginOtp = async (data) => {
  const response = await API.post("/auth/send-otp", data);
  return response.data;
};

// 🚀 NAYA: OTP Verify karke Login karne ki API
export const verifyLoginOtp = async (data) => {
  const response = await API.post("/auth/verify-otp", data);
  return response.data;
};
