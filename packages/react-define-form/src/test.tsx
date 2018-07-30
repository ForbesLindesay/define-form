import * as React from 'react';
import defineForm from './';

const {Form, Fields, FormSpy} = defineForm(f => {
  const x = {
    name: f<string>(),
    bio: f<string>(),
    phone: f<string>(),
    age: f((value: string) => {
      if (/^[0-9]+$/.test(value)) {
        return parseInt(value, 10);
      } else {
        throw 'Please enter an integer';
      }
    }),
  };
  return x;
});

const MyForm = () => (
  <Form
    initialValues={{name: '', bio: '', phone: '', age: ''}}
    onSubmit={values => {
      const name: string = values.name;
      const bio: string = values.bio;
      const phone: string = values.phone;
      const age: number = values.age;
      console.log({name, bio, phone, age});
    }}
    validate={values => {
      return {};
    }}
    render={({handleSubmit, pristine, invalid}) => (
      <form onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Fields.name component="input" />
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
        </Fields.phone>

        <h2>Render Parsed Value</h2>
        <Fields.phone>
          {({input, meta}) => (
            <div>
              <label>Age</label>
              <input type="tel" {...input} placeholder="Age" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Fields.phone>

        <FormSpy>{props => props.values.age}</FormSpy>

        <button type="submit" disabled={pristine || invalid}>
          Submit
        </button>
      </form>
    )}
  />
);

export default MyForm;
