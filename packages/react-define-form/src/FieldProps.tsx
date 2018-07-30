import * as React from 'react';
import {AnyObject, FieldSubscription, IsEqual} from 'define-form';
import RenderableProps from './RenderableProps';

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

export default interface FieldProps<
  FieldValue,
  FieldName extends string | number | symbol = string,
  FormData extends AnyObject = {},
  ErrorValue = any
> extends RenderableProps<FieldRenderProps<FieldValue, FieldName, ErrorValue>> {
  isEqual?: IsEqual<FieldValue>;
  subscription?: FieldSubscription;
  validate?: (value: FieldValue, allValues: FormData) => any;
  value?: FieldValue;
};
