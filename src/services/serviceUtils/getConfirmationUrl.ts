import * as jwt from "jsonwebtoken";

export const getConfirmationUrl = (userId: string, email: string) => {
  console.log(userId);
  const token = jwt.sign(
    {
      user: {
        id: userId,
        email: email,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return `http://localhost:3000/user/confirm/${token}`;
};
