export default function createField<FieldValue = string>(): FieldSpec<
  FieldValue,
  FieldValue
>;
export default function createField<
  FieldValue = string,
  FieldValueParsed = FieldValue
>(
  parse: (value: FieldValue) => FieldValueParsed,
): FieldSpec<FieldValue, FieldValueParsed>;
export default function createField<
  FieldValue = string,
  FieldValueParsed = FieldValue
>(
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
