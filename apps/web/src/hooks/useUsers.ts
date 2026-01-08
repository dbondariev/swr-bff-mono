import useSWR from "swr";
import { UsersResponseSchema, type UsersResponse } from "@acme/contracts";
import { fetcher } from "../api/fetcher";

export function useUsers() {
  return useSWR<UsersResponse>("/api/users", async (url: string) => {
    const data = await fetcher<unknown>(url);
    return UsersResponseSchema.parse(data);
  });
}
