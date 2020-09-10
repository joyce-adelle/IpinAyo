import { registerEnumType } from 'type-graphql';

export enum UserRole {
  User = "user",
  Admin = "admin",
  Superadmin = "superadmin",
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "user role",
});
