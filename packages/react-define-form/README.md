# React Define Form

React define form offers alternative typescript bindings for [react-final-form](https://github.com/final-form/react-final-form). It requires you to "define" a form type, specifying the type of the form data.

## Installation

```
yarn add react-define-form
```

## Usage

```typescript
import * as React from 'react';
import defineForm from 'react-define-form';

const { Form, Fields } = defineForm(f => ({
  name: f<string>(),
  bio: f<string>(),
  phone: f<string>()
}));

const MyForm = () => (
  <Form
    initialValues={{ name: '', bio: '', phone: '' }}
    onSubmit={values => {
      console.log(values);
    }}
    validate={values => {
      return {};
    }}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Fields.name component="input" />
        </div>

        <h2>Render Function</h2>
        <Fields.bio
          render={({ input, meta }) => (
            <div>
              <label>Bio</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <h2>Render Function as Children</h2>
        <Fields.phone>
          {({ input, meta }) => (
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Fields.phone>

        <button type="submit" disabled={pristine || invalid}>
          Submit
        </button>
      </form>
    )}
  />
);

export default MyForm;
```

For full API docs, you can look at [react-final-form](https://github.com/final-form/react-final-form). The API for `Form` and `Fields.SOME_FIELD_NAME` in this module exactly match those of `Form`, `Field` and `FormSpy` in react-final-form, except that for `Field`, `name` is already set for you and this module does not support parse/format/allowNulls (`null` and `undefined` are not special cased and you should use the empty string directly instead).

## License

MIT
