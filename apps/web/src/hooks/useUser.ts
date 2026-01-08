import useSWR from "swr";
import { UserSchema, type User } from "@acme/contracts";
import { fetcher } from "../api/fetcher";

export type UserResponse = { user: User };

export function useUser(id: string | null) {
  return useSWR<UserResponse>(
    id ? `/api/users/${id}` : null,
    async (url: string) => {
      const data = await fetcher<unknown>(url);
      const parsed = data as { user: unknown };
      const user = UserSchema.parse(parsed.user);
      return { user };
    }
  );
}
