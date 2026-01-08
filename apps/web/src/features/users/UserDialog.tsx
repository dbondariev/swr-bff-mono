import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { User, UserCreate, UserUpdate } from "@acme/contracts";
import { UserCreateSchema, UserUpdateSchema } from "@acme/contracts";
import type { ZodIssue } from "zod";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  user?: User;
  onClose: () => void;
  onSubmit: (payload: UserCreate | UserUpdate) => Promise<void>;
};

type FormShape = UserCreate;

type ErrorMap = Record<string, string>;

function toCreateDefaults(): FormShape {
  return {
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" },
    },
    company: { name: "", catchPhrase: "", bs: "" },
  };
}

function pathKey(path: (string | number)[]) {
  return path.map(String).join(".");
}

function issuesToMap(issues: ZodIssue[]): ErrorMap {
  const map: ErrorMap = {};
  for (const issue of issues) {
    const key = pathKey(issue.path);
    if (!key) continue;
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}

export function UserDialog({ open, mode, user, onClose, onSubmit }: Props) {
  const initial = useMemo<FormShape>(() => {
    if (mode === "edit" && user) {
      const { id: _id, ...rest } = user;
      return rest;
    }
    return toCreateDefaults();
  }, [mode, user]);

  const schema = useMemo(
    () => (mode === "create" ? UserCreateSchema : UserUpdateSchema),
    [mode]
  );

  const [form, setForm] = useState<FormShape>(initial);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setForm(initial);
    setTouched({});
  }, [initial, open]);

  const validation = useMemo(() => schema.safeParse(form), [schema, form]);
  const errors: ErrorMap = useMemo(
    () => (validation.success ? {} : issuesToMap(validation.error.issues)),
    [validation]
  );

  const canSave = validation.success && !saving;

  function markTouched(key: string) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function fieldError(key: string) {
    if (!touched[key]) return { error: false, helperText: " " as const };
    const msg = errors[key];
    return { error: Boolean(msg), helperText: msg ?? (" " as const) };
  }

  async function handleSave() {
    if (!validation.success) {
      const nextTouched: Record<string, boolean> = {};
      for (const key of Object.keys(errors)) nextTouched[key] = true;
      setTouched((prev) => ({ ...prev, ...nextTouched }));
      return;
    }

    setSaving(true);
    try {
      await onSubmit(form as unknown as UserCreate | UserUpdate);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "create" ? "Add user" : "Edit user";

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => markTouched("name")}
              fullWidth
              {...fieldError("name")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onBlur={() => markTouched("username")}
              fullWidth
              {...fieldError("username")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => markTouched("email")}
              fullWidth
              {...fieldError("email")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={() => markTouched("phone")}
              fullWidth
              {...fieldError("phone")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Website (hostname, e.g. example.com)"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              onBlur={() => markTouched("website")}
              fullWidth
              {...fieldError("website")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Company name"
              value={form.company.name}
              onChange={(e) =>
                setForm({ ...form, company: { ...form.company, name: e.target.value } })
              }
              onBlur={() => markTouched("company.name")}
              fullWidth
              {...fieldError("company.name")}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Company catchPhrase"
              value={form.company.catchPhrase}
              onChange={(e) =>
                setForm({
                  ...form,
                  company: { ...form.company, catchPhrase: e.target.value },
                })
              }
              onBlur={() => markTouched("company.catchPhrase")}
              fullWidth
              {...fieldError("company.catchPhrase")}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Company bs"
              value={form.company.bs}
              onChange={(e) =>
                setForm({ ...form, company: { ...form.company, bs: e.target.value } })
              }
              onBlur={() => markTouched("company.bs")}
              fullWidth
              {...fieldError("company.bs")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="City"
              value={form.address.city}
              onChange={(e) =>
                setForm({ ...form, address: { ...form.address, city: e.target.value } })
              }
              onBlur={() => markTouched("address.city")}
              fullWidth
              {...fieldError("address.city")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Zipcode"
              value={form.address.zipcode}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, zipcode: e.target.value },
                })
              }
              onBlur={() => markTouched("address.zipcode")}
              fullWidth
              {...fieldError("address.zipcode")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Street"
              value={form.address.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, street: e.target.value },
                })
              }
              onBlur={() => markTouched("address.street")}
              fullWidth
              {...fieldError("address.street")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Suite"
              value={form.address.suite}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, suite: e.target.value },
                })
              }
              onBlur={() => markTouched("address.suite")}
              fullWidth
              {...fieldError("address.suite")}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Geo lat"
              value={form.address.geo.lat}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: {
                    ...form.address,
                    geo: { ...form.address.geo, lat: e.target.value },
                  },
                })
              }
              onBlur={() => markTouched("address.geo.lat")}
              fullWidth
              {...fieldError("address.geo.lat")}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Geo lng"
              value={form.address.geo.lng}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: {
                    ...form.address,
                    geo: { ...form.address.geo, lng: e.target.value },
                  },
                })
              }
              onBlur={() => markTouched("address.geo.lng")}
              fullWidth
              {...fieldError("address.geo.lng")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
