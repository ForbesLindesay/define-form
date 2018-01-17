import * as React from 'react';
import {
  AnyObject,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldSubscription,
} from 'define-form';

const {Form, Field} = require('react-final-form');

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
export interface FormProps<FormData extends AnyObject, ErrorValue = any>
  extends Config<FormData, ErrorValue>,
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
  subscription?: FieldSubscription;
  validate?: (value: FieldValue, allValues: FormData) => any;
  value?: FieldValue;
}

function createField<FieldValue = string>(): FieldSpec<FieldValue> {
  return true as any;
}
export class FieldSpec<FieldValue> {
  protected value: FieldValue;
}
export default function defineForm<FormData extends AnyObject, ErrorValue>(
  fields: (
    createField: <FieldValue = string>() => FieldSpec<FieldValue>,
  ) => {[FieldName in keyof FormData]: FieldSpec<FormData[FieldName]>},
): {
  readonly Form: React.ComponentType<FormProps<FormData, ErrorValue>>;
  readonly Fields: {
    readonly [FieldName in keyof FormData]: React.ComponentType<
      FieldProps<FormData[FieldName], FieldName, FormData, ErrorValue>
    >
  };
} {
  const f = Object.keys(fields(createField));
  const Fields: any = {};
  f.forEach(name => {
    Fields[name] = (props: any) => (
      <Field
        {...props}
        name={name}
        allowNull={true}
        format={null}
        parse={null}
      />
    );
  });
  return {Form: Form as any, Fields};
}
