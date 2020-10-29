import { Resolver, Query, Mutation, Arg, Ctx, Args } from "type-graphql";
import { CreateRelatedPhrasesInput } from "../inputs/CreateRelatedPhrases.input";
import { UpdateRelatedPhrasesInput } from "../inputs/UpdateRelatedPhrases.input";
import { Inject } from "typedi";
import { RelatedPhrasesService } from "../../services/RelatedPhrasesService";
import { Context } from "../../context/context.interface";
import { MyError } from "../../services/serviceUtils/MyError";
import { UserError } from "../../utilities/genericTypes";
import {
  BooleanPayload,
  BooleanType,
  RelatedPhrasePayload,
  RelatedPhrasesPayload,
} from "../../services/serviceUtils/Payloads";
import { IdArgs } from "../arguments/id.args";

@Resolver()
export class RelatedPhrasesResolver {
  @Inject()
  private readonly relatedPhrasesService: RelatedPhrasesService;

  @Query(() => RelatedPhrasesPayload)
  relatedPhrases() {
    return this.relatedPhrasesService.getAllRelatedPhrases();
  }

  @Query(() => RelatedPhrasePayload)
  async relatedPhrase(@Args() { id }: IdArgs) {
    try {
      return await this.relatedPhrasesService.getRelatedPhrase(id);
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => RelatedPhrasePayload)
  async createRelatedPhrases(
    @Ctx() { user }: Context,
    @Arg("data") data: CreateRelatedPhrasesInput
  ) {
    try {
      let relatedPhrase = await this.relatedPhrasesService.createRelatedPhrase(
        user,
        data
      );
      return relatedPhrase;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => RelatedPhrasePayload)
  async updateRelatedPhrases(
    @Ctx() { user }: Context,
    @Args() { id }: IdArgs,
    @Arg("data") data: UpdateRelatedPhrasesInput
  ) {
    try {
      let relatedPhrases = await this.relatedPhrasesService.updateRelatedPhrases(
        user,
        id,
        data
      );
      return relatedPhrases;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }

  @Mutation(() => BooleanPayload)
  async deleteRelatedPhrase(@Ctx() { user }: Context, @Args() { id }: IdArgs) {
    try {
      const booleanType = new BooleanType();
      const del = await this.relatedPhrasesService.deleteRelatedPhrase(
        user,
        id
      );
      booleanType.done = del;
      return booleanType;
    } catch (e) {
      if (e instanceof MyError) {
        return new UserError(e.message);
      }
    }
  }
}
