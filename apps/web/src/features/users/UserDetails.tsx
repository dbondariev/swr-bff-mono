import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";
import type { User } from "@acme/contracts";

type Props = {
  user?: User;
  isLoading: boolean;
  error?: unknown;
  onRefresh: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function UserDetails({
                              user,
                              isLoading,
                              error,
                              onRefresh,
                              onEdit,
                              onDelete,
                            }: Props) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Details
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onEdit} disabled={!user}>
            Edit user
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            disabled={!user}
          >
            Delete
          </Button>
          <Button variant="text" onClick={onRefresh}>
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {isLoading && (
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="40%" height={36} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="rounded" height={120} />
        </Stack>
      )}

      {typeof error === "string" && !isLoading && (
        <Alert severity="error">{error}</Alert>
      )}

      {!isLoading && !error && user && (
        <Stack spacing={1.2}>
          <Typography variant="h5" fontWeight={800}>
            {user.name}
          </Typography>

          <Typography>
            <b>Username:</b> @{user.username}
          </Typography>
          <Typography>
            <b>Email:</b> {user.email}
          </Typography>
          <Typography>
            <b>Phone:</b> {user.phone}
          </Typography>
          <Typography>
            <b>Website:</b> {user.website}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography>
            <b>Address:</b> {user.address.city}, {user.address.street}, {user.address.suite} (
            {user.address.zipcode})
          </Typography>
          <Typography color="text.secondary">
            <b>Geo:</b> {user.address.geo.lat}, {user.address.geo.lng}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography>
            <b>Company:</b> {user.company.name}
          </Typography>
          <Typography color="text.secondary">{user.company.catchPhrase}</Typography>
          <Typography color="text.secondary">{user.company.bs}</Typography>
        </Stack>
      )}
    </Box>
  );
}
