import useSWR from "swr";
import { UsersSchema, type Users } from "@acme/contracts";
import { fetcher } from "../api/fetcher";

export type UsersResponse = { users: Users };

export function useUsers() {
  return useSWR<UsersResponse>("/api/users", async (url: string) => {
    const data = await fetcher<unknown>(url);
    const parsed = data as { users: unknown };
    const users = UsersSchema.parse(parsed.users);
    return { users };
  });
}
