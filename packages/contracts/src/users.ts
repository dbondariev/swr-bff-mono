import { z } from "zod";

export const GeoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const AddressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: GeoSchema,
});

export const CompanySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const WebsiteHostnameSchema = z
  .string()
  .min(1)
  .refine(
    (v) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v),
    "Expected hostname like example.com"
  );

export const UserIdSchema = z.string().min(1);

export const UserSchema = z.object({
  id: UserIdSchema,
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  address: AddressSchema,
  phone: z.string(),
  website: WebsiteHostnameSchema,
  company: CompanySchema,
});

export const UsersSchema = z.array(UserSchema);

export const UsersResponseSchema = z.object({
  users: UsersSchema,
});

export const UserCreateSchema = UserSchema.omit({ id: true });
export const UserUpdateSchema = UserSchema.omit({ id: true });

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
