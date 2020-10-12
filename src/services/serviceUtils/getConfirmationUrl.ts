import * as jwt from "jsonwebtoken";

export const getConfirmationUrl = (userId: string, email?: string) => {
  const token = jwt.sign(
    {
      user: {
        id: userId,
        email: email ? email : "",
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return `http://localhost:4000/user/confirm/${token}`;
};
