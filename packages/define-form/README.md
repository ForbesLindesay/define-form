# Define Form

Define form offers alternative typescript bindings for [final-form](https://github.com/final-form/final-form). The key difference is that the form data is now a strongly typed object, rather than an any. This make the `initialValues` config option required.

## Installation

```
yarn add define-form
```

## Usage

```typescript
import defineForm from 'define-form';

interface FormState {
  name: string;
}
type ErrorValue = string;
const form = defineForm<FormState, ErrorValue>({
  initialValues: {name: ''}, // required
  onSubmit, // required
  validate
})

// Subscribe to form state updates
const unsubscribe = form.subscribe(
  formState => {
    // Update UI
  },
  { // FormSubscription: the list of values you want to be updated about
    dirty: true,
    valid: true,
    values: true
  }
})

// Subscribe to field state updates
const unregisterField = form.registerField(
  'username',
  fieldState => {
    // Update field UI
    const { blur, change, focus, ...rest } = fieldState
    // In addition to the values you subscribe to, field state also
    // includes functions that your inputs need to update their state.
  },
  { // FieldSubscription: the list of values you want to be updated about
    active: true,
    dirty: true,
    touched: true,
    valid: true,
    value: true
  }
)

// Submit
form.submit() // only submits if all validation passes
```

If you like this, you may also want to check out [react-define-form](https://www.npmjs.com/package/react-define-form)

## License

MIT
