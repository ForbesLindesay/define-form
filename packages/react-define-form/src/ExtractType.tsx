import { FieldSpec } from "./createField";

export type ValueProperty<T> = 
  T extends FieldSpec<infer U, any> ? U : never;
export type ParsedValueProperty<T> = 
  T extends FieldSpec<any, infer U> ? U : never;