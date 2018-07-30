import {FormState, FormSubscription} from 'define-form';
import RenderableProps from './RenderableProps';
import {SubsetFormApi} from './FormProps';

export interface FormSpyRenderProps<FormData, ErrorValue>
  extends FormState<FormData, ErrorValue>,
    SubsetFormApi<FormData> {}

export default interface FormSpyProps<FormData, ErrorValue>
  extends RenderableProps<FormSpyRenderProps<FormData, ErrorValue>> {
  onChange?: (formState: FormState<FormData, ErrorValue>) => void;
  subscription?: FormSubscription;
};
