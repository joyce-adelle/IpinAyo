import { InputType, Field, ID } from "type-graphql";
import { IsEnum, IsDefined, Length } from "class-validator";
import { IsId } from "../validations/Id.validation";
import { UserRole } from "../../utilities/UserRoles";

@InputType()
export class ChangeUserRoleInput {
  @Field(() => ID)
  @Length(1)
  @IsId({ message: "$value is not a valid user id" })
  @IsDefined()
  userToChangeId: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  @IsDefined()
  role: UserRole;
}
