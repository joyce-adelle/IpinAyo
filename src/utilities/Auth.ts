import * as bcrypt from "bcryptjs";

export default class Auth {
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 13);
  }

  public static async compare(
    password: string,
    dbHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, dbHash);
  }
}
