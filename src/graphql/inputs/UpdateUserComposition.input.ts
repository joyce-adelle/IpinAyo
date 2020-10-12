import { InputType, Field } from "type-graphql";
import { CompositionType } from "../../utilities/CompositionType";
import {
  IsBoolean,
  ArrayUnique,
  IsOptional,
  IsEnum,
  ArrayNotEmpty,
  ArrayMaxSize,
} from "class-validator";

@InputType()
export class UpdateUserCompositionInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isComposer?: boolean;

  @Field(() => [CompositionType], { nullable: true })
  @IsOptional()
  @IsEnum(CompositionType, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMaxSize(2)
  typeOfCompositions?: CompositionType[];
}
