export function GetRandomString(len: number): string {
  const al = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return [...Array(len)].map(() => al[~~(Math.random() * al.length)]).join("");
}
