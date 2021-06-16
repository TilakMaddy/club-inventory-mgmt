import { useState, useEffect } from "react";

export default function useForm(initial = {}) {

  const [inputs, setInputs] = useState(initial);
  const vals = Object.values(initial).join(' ');

  useEffect(() => {
    setInputs(initial);
  }, [vals]);

  function handleChange(e) {

    let { name, value, type } = e.target;

    // e.target.value will always be a string so we do this kind of stuff

    if (type === 'number') {
      value = parseInt(value);
    }

    if(type === "file") {
      //value = e.target.files[0];
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name] : value
    })
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    setInputs(Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    ))
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  }

}