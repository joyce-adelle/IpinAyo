import { IsOptional, IsString} from "class-validator";
import { ArgsType, Field, ID } from "type-graphql";
import { IsId } from "../validations/Id.validation";

@ArgsType()
export class SearchMusicArgs {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    query?: string;
  
    @Field(() => [ID], { nullable: true })
    @IsOptional()
    @IsId({ message: "$value is not a valid id", each: true })
    categoryIds?: string[];
  
    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    exactCategory?: boolean;
  }
