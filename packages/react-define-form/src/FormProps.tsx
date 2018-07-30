import {
  AnyObject,
  Config,
  Decorator,
  FormState,
  FormSubscription,
} from 'define-form';
import RenderableProps from './RenderableProps';

export interface SubsetFormApi<FormData extends AnyObject> {
  batch: (fn: () => void) => void;
  blur: (name: keyof FormData) => void;
  change: <TKey extends keyof FormData>(
    name: keyof FormData,
    value: FormData[TKey],
  ) => void;
  focus: (name: keyof FormData) => void;
  initialize: (values: Readonly<FormData>) => void;
  mutators?: {[key: string]: Function};
  reset: () => void;
}

export interface FormRenderProps<FormData extends AnyObject, ErrorValue = any>
  extends FormState<FormData, ErrorValue>,
    SubsetFormApi<FormData> {
  batch: (fn: () => void) => void;
  handleSubmit: (event?: React.SyntheticEvent<HTMLFormElement>) => void;
}
export default interface FormProps<
  FormData extends AnyObject,
  FormDataParsed extends AnyObject,
  ErrorValue = any
>
  extends Config<FormData, FormDataParsed, ErrorValue>,
    RenderableProps<FormRenderProps<FormData, ErrorValue>> {
  subscription?: FormSubscription;
  decorators?: Decorator<FormData, ErrorValue>[];
};
