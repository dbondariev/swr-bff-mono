import { List, ListItemButton, ListItemText, Typography, Box } from "@mui/material";
import type { User } from "@acme/contracts";

type Props = {
  users: User[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function UsersList({ users, selectedId, onSelect }: Props) {
  return (
    <List disablePadding>
      {users.map((u) => (
        <ListItemButton
          key={u.id}
          selected={selectedId === u.id}
          onClick={() => onSelect(u.id)}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemText
            primary={
              <Typography fontWeight={700} noWrap>
                {u.name}
              </Typography>
            }
            secondary={
              <Box component="span" sx={{ color: "text.secondary" }}>
                @{u.username}
              </Box>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
}
