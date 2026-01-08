import {useMemo, useState} from "react";
import {Alert, Box, Button, Card, CardContent, Container, Divider, Skeleton, Stack, Typography,} from "@mui/material";
import type {User, UserCreate, UserUpdate} from "@acme/contracts";
import {useUsers} from "../../hooks/useUsers";
import {useUser} from "../../hooks/useUser";
import {UsersList} from "./UsersList";
import {UserDetails} from "./UserDetails";
import {UserDialog} from "./UserDialog";
import {api} from "../../api/client";

type UserResponse = { user: User };
type DeleteResponse = { success: boolean };

export function UsersPage() {
  const [selectedId, setSelectedId] = useState<string | null>("1");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const usersQuery = useUsers();
  const userQuery = useUser(selectedId);

  const users = usersQuery.data?.users ?? [];
  const selectedUser = userQuery.data?.user;

  const selectedExists = useMemo(
    () => (selectedId ? users.some((u) => u.id === selectedId) : false),
    [users, selectedId]
  );

  function openCreate() {
    setDialogMode("create");
    setDialogOpen(true);
  }

  function openEdit() {
    if (!selectedUser) return;
    setDialogMode("edit");
    setDialogOpen(true);
  }

  async function handleCreate(payload: UserCreate | UserUpdate) {
    const create = payload as UserCreate;

    const tempId = `temp-${Date.now()}`;
    const optimisticUser: User = { id: tempId, ...create };

    await usersQuery.mutate(
      async (current) => {
        const created = await api<UserResponse>("/api/users", {
          method: "POST",
          body: JSON.stringify(create),
        });
        return { users: [created.user, ...(current?.users ?? [])] };
      },
      {
        optimisticData: (current) => ({
          users: [optimisticUser, ...(current?.users ?? [])],
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );

    await usersQuery.mutate();
  }

  async function handleEdit(payload: UserCreate | UserUpdate) {
    if (!selectedUser) return;

    const update = payload as UserUpdate;
    const id = selectedUser.id;

    await usersQuery.mutate(
      async (current) => {
        const updated = await api<UserResponse>(`/api/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(update),
        });

        const next = (current?.users ?? []).map((u) => (u.id === id ? updated.user : u));
        return { users: next };
      },
      {
        optimisticData: (current) => ({
          users: (current?.users ?? []).map((u) => (u.id === id ? { id, ...update } : u)),
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );

    await userQuery.mutate();
  }

  async function handleDelete() {
    if (!selectedUser) return;
    const id = selectedUser.id;
    const currentUsers = usersQuery.data?.users ?? [];

    // Find the next user to select after deletion
    const currentIndex = currentUsers.findIndex(u => u.id === id);
    const nextUser = currentUsers[currentIndex + 1] || currentUsers[currentIndex - 1] || null;

    try {
      await usersQuery.mutate(
        async (current) => {
          await api<DeleteResponse>(`/api/users/${id}`, { method: "DELETE" });
          return { users: (current?.users ?? []).filter((u) => u.id !== id) };
        },
        {
          optimisticData: (current) => ({
            users: (current?.users ?? []).filter((u) => u.id !== id),
          }),
          rollbackOnError: true,
          populateCache: true,
          revalidate: true,
        }
      );

      // Update selected ID to next available user
      setSelectedId(nextUser?.id ?? null);

      // Force refresh of the user query
      await userQuery.mutate();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" fontWeight={900}>
          Users
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Add user
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1, minWidth: 320 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Users list
              </Typography>
              <Button variant="text" onClick={() => usersQuery.mutate()}>
                Refresh
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {usersQuery.isLoading && (
              <Stack spacing={1}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={56} />
                ))}
              </Stack>
            )}

            {usersQuery.error && !usersQuery.isLoading && (
              <Alert severity="error">Failed to load users.</Alert>
            )}

            {!usersQuery.isLoading && !usersQuery.error && (
              <UsersList
                users={users}
                selectedId={selectedExists ? selectedId : null}
                onSelect={(id) => setSelectedId(id)}
              />
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 2, minWidth: 420 }}>
          <CardContent>
            <UserDetails
              user={selectedUser}
              isLoading={userQuery.isLoading}
              error={userQuery.error}
              onRefresh={() => userQuery.mutate()}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

            <Box mt={2} />
          </CardContent>
        </Card>
      </Stack>

      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        user={dialogMode === "edit" ? selectedUser : undefined}
        onClose={() => setDialogOpen(false)}
        onSubmit={dialogMode === "create" ? handleCreate : handleEdit}
      />
    </Container>
  );
}
