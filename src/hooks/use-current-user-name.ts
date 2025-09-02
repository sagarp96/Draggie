import { useUserAuth } from "./useAuth";

export const useCurrentUserName = (): string => {
  const { data: user } = useUserAuth();
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Anonymous"
  );
};
