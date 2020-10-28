import {sign} from "jsonwebtoken";

export const getPasswordConfirmationUrl =  (userId: string, password: string) => {
  const token = sign(
    {
      user: {
        id: userId,
        password: password
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return `http://localhost:3000/user/resetpassword/${token}`;
};
