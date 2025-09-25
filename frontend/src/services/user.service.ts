import { apiRequest } from "@/utils/requestHandler";

// get user

const getUser = async () => {
  return await apiRequest("/auth/user");
};

// upgrade plan - admin only

const upgradeProPlan = async (tenantId: string) => {
  return await apiRequest(`/user/upgrade-plan/${tenantId}`, { method: "POST" });
}

export { getUser, upgradeProPlan };