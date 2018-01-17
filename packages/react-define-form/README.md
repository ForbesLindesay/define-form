# React Define Form

React define form offers alternative typescript bindings for [react-final-form](https://github.com/final-form/react-final-form). It requires you to "define" a form type, specifying the type of the form data.

## Installation

```
yarn add react-define-form
```

## Usage

```typescript
import defineForm from 'react-define-form';

const {Form, Fields} = defineForm(f => ({
  name: f<string>(),
  interests: f<string>(),
  bio: f<string>(),
  phone: f<string>()
}));

const MyForm = () => (
  <Form
    initialValues={{firstName: '', interests: '', bio: '', phone: ''}}
    onSubmit={onSubmit}
    validate={validate}
    render={({handleSubmit, pristine, invalid}) => (
      <form onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Fields.firstName component="input" placeholder="First Name" />
        </div>

        <h2>An Arbitrary Reusable Input Component</h2>
        <div>
          <label>Interests</label>
          <Fields.interests component={InterestPicker} />
        </div>

        <h2>Render Function</h2>
        <Fields.bio
          render={({input, meta}) => (
            <div>
              <label>Bio</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <h2>Render Function as Children</h2>
        <Fields.phone>
          {({input, meta}) => (
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>

        <button type="submit" disabled={pristine || invalid}>
          Submit
        </button>
      </form>
    )}
  />
);
```

For full API docs, you can look at [react-final-form](https://github.com/final-form/react-final-form). The API for `Form` and `Fields.SOME_FIELD_NAME` in this module exactly match those of `Form` and `Field` in react-final-form, except that `name` is already set for you and this module does not support parse/format/allowNulls (`null` and `undefined` are not special cased and you should use the empty string directly instead).

## License

MIT
