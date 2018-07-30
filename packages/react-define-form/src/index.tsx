import * as React from 'react';
import FieldProps, {FieldRenderProps} from './FieldProps';
import FormProps, {FormRenderProps} from './FormProps';
import FormSpyProps from './FormSpyProps';
import createField, {FieldSpec, CreateField} from './createField';
import {ValueProperty, ParsedValueProperty} from './ExtractType';

export {FieldProps, FieldRenderProps, FormProps, FormRenderProps, FormSpyProps};

const {Form, Field, FormSpy} = require('react-final-form');

export type FormSpecBase = {[FieldName in string]: FieldSpec<any, any>};
export type GetFields<FormSpec extends FormSpecBase> = (
  createField: CreateField,
) => FormSpec;

export type Fields<FormData, ErrorValue> = {
  readonly [FieldName in keyof FormData]: React.ComponentType<
    FieldProps<FormData[FieldName], FieldName, FormData, ErrorValue>
  >
};
export interface DefinedFormAPI<FormData, FormDataParsed, ErrorValue> {
  readonly Form: React.ComponentType<
    FormProps<FormData, FormDataParsed, ErrorValue>
  >;
  readonly Fields: {
    readonly [FieldName in keyof FormData]: React.ComponentType<
      FieldProps<FormData[FieldName], FieldName, FormData, ErrorValue>
    >
  };
  readonly FormSpy: React.ComponentType<FormSpyProps<FormData, ErrorValue>>;
  extend<FormSpec extends FormSpecBase>(
    getFields: GetFields<FormSpec>,
  ): DefinedFormAPI<
    FormData & {[key in keyof FormSpec]: ValueProperty<FormSpec[key]>},
    FormDataParsed &
      {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>},
    ErrorValue
  >;
}

export default function defineForm<
  FormSpec extends FormSpecBase,
  ErrorValue = any
>(
  getFields: GetFields<FormSpec>,
): DefinedFormAPI<
  {[key in keyof FormSpec]: ValueProperty<FormSpec[key]>},
  {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>},
  ErrorValue
> {
  return defineFormInner(getFields, {});
}
function defineFormInner<
  FormSpec extends FormSpecBase,
  FormSpecExtra extends FormSpecBase,
  ErrorValue = any
>(
  getFields: GetFields<FormSpec>,
  existingFields: FormSpecExtra,
): DefinedFormAPI<
  {[key in keyof FormSpec]: ValueProperty<FormSpec[key]>} &
    {[key in keyof FormSpecExtra]: ValueProperty<FormSpecExtra[key]>},
  {[key in keyof FormSpec]: ParsedValueProperty<FormSpec[key]>} &
    {[key in keyof FormSpecExtra]: ParsedValueProperty<FormSpecExtra[key]>},
  ErrorValue
> {
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
    FormSpy,
    extend(getFields): any {
      return defineFormInner(getFields, {...Fields});
    },
  };
}
