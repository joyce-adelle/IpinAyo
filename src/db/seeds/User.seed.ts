import { CompositionType } from "../../utilities/CompositionType";
import { UserRole } from "../../utilities/UserRoles";

export const UserSeed = [
  {
    username: "user2",
    firstName: "User2",
    lastName: "Happy2",
    email: "user2@mail.com",
    password: "user2secret",
    isComposer: false,
  },
  {
    username: "user3",
    firstName: "User3",
    lastName: "Happy3",
    email: "user3@mail.com",
    password: "user3secret",
    isComposer: true,
    typeOfCompositions: [CompositionType.Sacred, CompositionType.Secular]
  },
  {
    username: "user4",
    firstName: "User4",
    lastName: "Happy4",
    email: "user4@mail.com",
    password: "user4secret",
    isComposer: false,
    role: UserRole.Admin
  },
  {
    username: "user5",
    firstName: "User5",
    lastName: "Happy5",
    email: "user5@mail.com",
    password: "user5secret",
    isComposer: true,
    typeOfCompositions: [CompositionType.Sacred],
    role: UserRole.Admin
  },
  {
    username: "user6",
    firstName: "User6",
    lastName: "Happy6",
    email: "user6@mail.com",
    password: "user6secret",
    isComposer: false,
  },
  {
    username: "user7",
    firstName: "User7",
    lastName: "Happy7",
    email: "user7@mail.com",
    password: "user7secret",
    isComposer: true,
    typeOfCompositions: [CompositionType.Secular]
  },
  {
    username: "user8",
    firstName: "User8",
    lastName: "Happy8",
    email: "user8@mail.com",
    password: "user8secret",
    isComposer: false,
    role: UserRole.Admin
  },
  {
    username: "user9",
    firstName: "User9",
    lastName: "Happy9",
    email: "user9@mail.com",
    password: "user9secret",
    isComposer: false,
    role: UserRole.Superadmin
  }
];
