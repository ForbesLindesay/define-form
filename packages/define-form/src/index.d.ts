export interface AnyObject {
  [key: string]: any;
}
export type Errors<FormData extends AnyObject, ErrorValue> = {
  readonly [P in keyof FormData]?: ErrorValue
};

export interface Subscription {
  [key: string]: boolean;
}
export type Subscriber<V> = (value: V) => void;
export type IsEqual<V = any> = (a: V, b: V) => boolean;

export interface FormSubscription extends Subscription {
  active: boolean;
  dirty: boolean;
  dirtySinceLastSubmit: boolean;
  error: boolean;
  errors: boolean;
  initialValues: boolean;
  invalid: boolean;
  pristine: boolean;
  submitError: boolean;
  submitErrors: boolean;
  submitFailed: boolean;
  submitSucceeded: boolean;
  submitting: boolean;
  valid: boolean;
  validating: boolean;
  values: boolean;
}

export interface FormState<FormData extends AnyObject, ErrorValue = any> {
  // by default: all values are subscribed. if subscription is specified, some values may be undefined
  active: undefined | string;
  dirty: boolean;
  dirtySinceLastSubmit: boolean;
  error: ErrorValue;
  errors: Errors<FormData, ErrorValue>;
  initialValues: FormData;
  invalid: boolean;
  pristine: boolean;
  submitError: ErrorValue;
  submitErrors: Errors<FormData, ErrorValue>;
  submitFailed: boolean;
  submitSucceeded: boolean;
  submitting: boolean;
  valid: boolean;
  validating: boolean;
  values: FormData;
}

export type FormSubscriber<
  FormData extends AnyObject,
  ErrorValue = any
> = Subscriber<FormState<FormData, ErrorValue>>;

export interface FieldState<FieldValue, ErrorValue = any> {
  active?: boolean;
  blur: () => void;
  change: (value: FieldValue) => void;
  data?: object;
  dirty?: boolean;
  dirtySinceLastSubmit?: boolean;
  error?: ErrorValue;
  focus: () => void;
  initial?: FieldValue;
  invalid?: boolean;
  length?: number;
  name: string;
  pristine?: boolean;
  submitError?: ErrorValue;
  submitFailed?: boolean;
  submitSucceeded?: boolean;
  touched?: boolean;
  valid?: boolean;
  value?: FieldValue;
  visited?: boolean;
}

export interface FieldSubscription extends Subscription {
  active: boolean;
  data: boolean;
  dirty: boolean;
  dirtySinceLastSubmit: boolean;
  error: boolean;
  initial: boolean;
  invalid: boolean;
  length: boolean;
  pristine: boolean;
  submitError: boolean;
  submitFailed: boolean;
  submitSucceeded: boolean;
  touched: boolean;
  valid: boolean;
  value: boolean;
  visited: boolean;
}

export type FieldSubscriber<FieldValue, ErrorValue = any> = Subscriber<
  FieldState<FieldValue, ErrorValue>
>;

export type Unsubscribe = () => void;

type FieldValidator<FieldValue, FormData, ErrorValue = any> = (
  value: FieldValue,
  allValues: FormData,
) => ErrorValue | Promise<ErrorValue>;
type GetFieldValidator<
  FieldValue,
  FormData,
  ErrorValue = any
> = () => FieldValidator<FieldValue, FormData, ErrorValue>;

export interface FieldConfig<FieldValue, FormData, ErrorValue = any> {
  isEqual?: IsEqual;
  getValidator?: GetFieldValidator<FieldValue, FormData, ErrorValue>;
  validateFields?: string[];
}

export type RegisterField<FormData, ErrorValue = any> = <FieldValue>(
  name: string,
  subscriber: FieldSubscriber<FieldValue, ErrorValue>,
  subscription: FieldSubscription,
  config: FieldConfig<FieldValue, FormData, ErrorValue>,
) => Unsubscribe;

export interface InternalFieldState<FieldValue, FormData, ErrorValue = any> {
  active: boolean;
  blur: () => void;
  change: (value: FieldValue) => void;
  data: object;
  error?: ErrorValue;
  focus: () => void;
  isEqual: IsEqual;
  lastFieldState?: FieldState<FieldValue, ErrorValue>;
  length?: any;
  name: string;
  submitError?: ErrorValue;
  pristine: boolean;
  touched: boolean;
  validateFields?: string[];
  validators: {
    [index: number]: GetFieldValidator<FieldValue, FormData, ErrorValue>;
  };
  valid: boolean;
  visited: boolean;
}

export interface InternalFormState<FormData, ErrorValue = any> {
  active?: string;
  dirtySinceLastSubmit: boolean;
  error?: ErrorValue;
  errors: Errors<FormData, ErrorValue>;
  initialValues: FormData;
  lastSubmittedValues?: FormData;
  pristine: boolean;
  submitError?: ErrorValue;
  submitErrors?: Errors<FormData, ErrorValue>;
  submitFailed: boolean;
  submitSucceeded: boolean;
  submitting: boolean;
  valid: boolean;
  validating: number;
  values: FormData;
}

export interface FormApi<FormData, ErrorValue = any> {
  batch: (fn: () => void) => void;
  blur: (name: string) => void;
  change: (name: string, value?: any) => void;
  focus: (name: string) => void;
  initialize: (values: FormData) => void;
  getRegisteredFields: () => string[];
  getState: () => FormState<FormData, ErrorValue>;
  mutators?: {[key: string]: Function};
  submit: () => Promise<Errors<FormData, ErrorValue> | undefined> | undefined;
  subscribe: (
    subscriber: FormSubscriber<FormData, ErrorValue>,
    subscription: FormSubscription,
  ) => Unsubscribe;
  registerField: RegisterField<FormData, ErrorValue>;
  reset: () => void;
}

export type DebugFunction<FormData, ErrorValue = any> = (
  state: FormState<FormData, ErrorValue>,
  fieldStates: {[key in keyof FormData]: FieldState<FormData[key], ErrorValue>},
) => void;

export interface MutableState<FormData, ErrorValue = any> {
  formState: InternalFormState<FormData, ErrorValue>;
  fields: {
    [key: string]: {
      [key in keyof FormData]: InternalFieldState<
        FormData[key],
        FormData,
        ErrorValue
      >
    };
  };
}

export type GetIn = (state: object, complexKey: string) => any;
export type SetIn = (state: object, key: string, value: any) => object;
export type ChangeValue = <
  Key extends keyof FormData,
  FormData,
  ErrorValue = any
>(
  state: MutableState<FormData, ErrorValue>,
  name: Key,
  mutate: (value: FormData[Key]) => FormData[Key],
) => void;
export interface Tools {
  changeValue: ChangeValue;
  getIn: GetIn;
  setIn: SetIn;
  shallowEqual: IsEqual;
}

export type Mutator<FormData, ErrorValue = any> = (
  args: any[],
  state: MutableState<FormData, ErrorValue>,
  tools: Tools,
) => any;

export interface Config<FormData, ErrorValue = any> {
  debug?: DebugFunction<FormData, ErrorValue>;
  initialValues: FormData;
  mutators?: {[key: string]: Mutator<FormData, ErrorValue>};
  onSubmit: (
    values: FormData,
    form: FormApi<FormData, ErrorValue>,
  ) =>
    | Errors<FormData, ErrorValue>
    | Promise<Errors<FormData, ErrorValue> | undefined>
    | undefined
    | void;
  validate?: (
    values: FormData,
  ) =>
    | Errors<FormData, ErrorValue>
    | Promise<Errors<FormData, ErrorValue> | undefined>;
  validateOnBlur?: boolean;
}

export type Decorator<FormData, ErrorValue = any> = (
  form: FormApi<FormData, ErrorValue>,
) => Unsubscribe;

export function createForm<FormData, ErrorValue = any>(
  config: Config<FormData, ErrorValue>,
): FormApi<FormData, ErrorValue>;
export const fieldSubscriptionItems: string[];
export const formSubscriptionItems: string[];
export const FORM_ERROR: any;
export function getIn(state: object, complexKey: string): any;
export function setIn(state: object, key: string, value: any): object;
export const version: string;
