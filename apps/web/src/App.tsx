import { SWRConfig } from "swr";
import { UsersPage } from "./features/users/UsersPage";

export default function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshInterval: 0,
        dedupingInterval: 5000,
        focusThrottleInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
      }}
    >
      <UsersPage />
    </SWRConfig>
  );
}
