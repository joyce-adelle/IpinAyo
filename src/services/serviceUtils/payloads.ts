
import { ObjectType, Field } from "type-graphql";
import { User } from '../../db/entities/User';
import { userResponse } from '../../utilities/genericTypes';

@ObjectType()
export class LoginType {
    @Field()
    public token: string;
}

export const LoginPayload = userResponse("LoginPayload", LoginType);
export const SignUpPayload = userResponse("SignUpPayload", User);
export const UserPayload = userResponse("UserPayload", User);
export const BooleanPayload = userResponse("BooleanPayload", User);
