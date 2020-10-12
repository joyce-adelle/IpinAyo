import * as jwt from "jsonwebtoken";

export const getPasswordConfirmationUrl =  (userId: string, password: string) => {
  const token = jwt.sign(
    {
      user: {
        id: userId,
        password: password
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return `http://localhost:4000/user/confirm/${token}`;
};
