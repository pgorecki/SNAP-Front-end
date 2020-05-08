import { useEffect, useState } from 'react';

export default function useForm(initialState = {}) {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return {
    values: state,
    errors,
    getValue(name) {
      return state[name];
    },
    setValue(name, value) {
      console.log('set form value', name, value);
      setState({
        ...state,
        [name]: value,
      });
    },
    setErrors(errors) {
      console.log(errors);
      if (typeof errors === 'string') {
        setErrors({
          error: [errors],
        });
      } else {
        setErrors(errors);
      }
    },
    getError(name) {
      const fieldErrors = errors[name];
      return Array.isArray(fieldErrors) ? fieldErrors.join('; ') : fieldErrors;
    },
    onChange(event, field) {
      setState({
        ...state,
        [field.name]: field.value,
      });
    },
    onChecked(event, field) {
      setState({
        ...state,
        [field.name]: field.checked,
      });
    },
    getArray(name) {
      if (Array.isArray(state[name])) {
        return state[name].join('\n');
      }
    },
    setArray(name, textString) {
      const elements = textString.split('\n');
      setState({
        ...state,
        [name]: elements,
      });
    },
  };
}
