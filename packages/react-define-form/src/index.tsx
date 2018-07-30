import * as React from 'react';
import {
  AnyObject,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldSubscription,
  IsEqual,
} from 'define-form';

const {Form, Field, FormSpy} = require('react-final-form');

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  component?: React.ComponentType<T> | string;
  render?: (props: T) => React.ReactNode;
}

// Form Props

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
export interface FormProps<
  FormData extends AnyObject,
  FormDataParsed extends AnyObject,
  ErrorValue = any
>
  extends Config<FormData, FormDataParsed, ErrorValue>,
    RenderableProps<FormRenderProps<FormData, ErrorValue>> {
  subscription?: FormSubscription;
  decorators?: Decorator<FormData, ErrorValue>[];
}

// Field

export interface FieldRenderProps<FieldValue, FieldName, ErrorValue = any> {
  input: {
    name: FieldName;
    onBlur: <T>(event?: React.FocusEvent<T>) => void;
    onChange: (
      event: React.ChangeEvent<{value: FieldValue}> | FieldValue,
    ) => void;
    onFocus: <T>(event?: React.FocusEvent<T>) => void;
    value: FieldValue;
  };
  meta: Partial<{
    active: boolean;
    dirty: boolean;
    error: ErrorValue;
    initial: boolean;
    invalid: boolean;
    pristine: boolean;
    submitError: ErrorValue;
    submitFailed: boolean;
    submitSucceeded: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
  }>;
}

export interface FieldProps<
  FieldValue,
  FieldName extends string = string,
  FormData extends AnyObject = {},
  ErrorValue = any
> extends RenderableProps<FieldRenderProps<FieldValue, FieldName, ErrorValue>> {
  isEqual?: IsEqual<FieldValue>;
  subscription?: FieldSubscription;
  validate?: (value: FieldValue, allValues: FormData) => any;
  value?: FieldValue;
}

export function createField<FieldValue = string>(): FieldSpec<
  FieldValue,
  FieldValue
>;
export function createField<FieldValue = string, FieldValueParsed = FieldValue>(
  parse: (value: FieldValue) => FieldValueParsed,
): FieldSpec<FieldValue, FieldValueParsed>;
export function createField<FieldValue = string, FieldValueParsed = FieldValue>(
  parse?: (value: FieldValue) => FieldValueParsed,
): FieldSpec<FieldValue, FieldValueParsed> {
  return {parse} as any;
}
export type CreateField = typeof createField;
export declare class FieldSpec<FieldValue, FieldValueParsed> {
  protected value: FieldValue;
  protected parsedValue: FieldValueParsed;
  parse: (value: FieldValue) => FieldValueParsed | undefined;
}

// FormSpy

export interface FormSpyRenderProps<FormData, ErrorValue>
  extends FormState<FormData, ErrorValue>,
    SubsetFormApi<FormData> {}

export interface FormSpyProps<FormData, ErrorValue>
  extends RenderableProps<FormSpyRenderProps<FormData, ErrorValue>> {
  onChange?: (formState: FormState<FormData, ErrorValue>) => void;
  subscription?: FormSubscription;
}

export type GetFields<FormData, FormDataParsed> = (
  createField: CreateField,
) => {
  [FieldName in keyof FormData & keyof FormDataParsed]: FieldSpec<
    FormData[FieldName],
    FormDataParsed[FieldName]
  >
};
export type Fields<FormData, ErrorValue> = {
  readonly [FieldName in string & keyof FormData]: React.ComponentType<
    FieldProps<FormData[FieldName], FieldName, FormData, ErrorValue>
  >
};
export interface DefinedFormAPI<FormData, FormDataParsed, ErrorValue> {
  readonly Form: React.ComponentType<FormProps<FormData, ErrorValue>>;
  readonly Fields: {
    readonly [FieldName in string & keyof FormData]: React.ComponentType<
      FieldProps<FormData[FieldName], FieldName, FormData, ErrorValue>
    >
  };
  readonly FormSpy: React.ComponentType<FormSpyProps<FormData, ErrorValue>>;
  extend<ExtraFormData, ExtraFormDataParsed = ExtraFormData>(
    getFields: GetFields<ExtraFormData, ExtraFormDataParsed>,
  ): DefinedFormAPI<
    FormData & ExtraFormData,
    FormDataParsed & ExtraFormDataParsed,
    ErrorValue
  >;
}
export default function defineForm<
  FormData extends AnyObject,
  ErrorValue,
  FormDataParsed extends AnyObject = FormData
>(
  getFields: GetFields<FormData, FormDataParsed>,
): DefinedFormAPI<FormData, FormDataParsed, ErrorValue> {
  return defineFormInner(getFields);
}
function defineFormInner<
  FormData extends AnyObject,
  FormDataParsed extends AnyObject,
  ErrorValue
>(
  getFields: any,
  existingFields: any = {},
): DefinedFormAPI<FormData, FormDataParsed, ErrorValue> {
  const fieldSpecs = getFields(createField);
  const fields = Object.keys(fieldSpecs);
  const Fields: any = existingFields;
  fields.forEach(name => {
    Fields[name] = (props: any) => (
      <Field
        validate={
          fieldSpecs[name].parse &&
          ((value: any) => {
            try {
              fieldSpecs[name].parse(value);
              return undefined;
            } catch (ex) {
              return ex.message || ex;
            }
          })
        }
        {...props}
        name={name}
        allowNull={true}
        format={null}
        parse={null}
      />
    );
  });
  return {
    Form: (props: any) => (
      <Form
        {...props}
        onSubmit={(data: any, form: any) => {
          const parsedValues: any = {};
          fields.forEach(fieldName => {
            if (fieldSpecs[fieldName].parse) {
              parsedValues[fieldName] = fieldSpecs[fieldName].parse(
                data[fieldName],
              );
            } else {
              parsedValues[fieldName] = data[fieldName];
            }
          });
          return props.onSubmit(parsedValues, form);
        }}
      />
    ),
    Fields,
    FormSpy: FormSpy as any,
    extend(getFields) {
      return defineFormInner(getFields, {...Fields});
    },
  };
}
