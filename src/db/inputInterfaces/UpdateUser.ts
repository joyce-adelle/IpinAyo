import { CompositionType } from '../../utilities/CompositionType';

export interface UpdateUser {
  email?: string;
  password?: string;
  isComposer?: boolean;
  isVerified?: boolean;
  typeOfCompositions?: CompositionType[];
}
