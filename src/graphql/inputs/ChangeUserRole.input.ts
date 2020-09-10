import { InputType, Field } from "type-graphql";
import { IsString, IsEnum, IsDefined } from "class-validator";
import { IsId } from "../validations/Id.validation";
import { UserRole } from '../../utilities/UserRoles';

@InputType()
export class ChangeUserRoleInput {
  @Field(() => String)
  @IsString()
  @IsId({ message: "$value is not a valid user id" })
  @IsDefined()
  userId: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  @IsDefined()
  role: UserRole;
}
