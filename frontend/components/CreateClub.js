import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useForm from "../lib/useForm";
import Form from "./styles/Form";
import DisplayError from "./ErrorMessage";
import { CLUBS_GENERAL_QUERY } from "../pages/clubs";

const CREATE_CLUB_MUTATION =  gql`

  mutation CREATE_CLUB_MUTATION(
    $name: String!
  ) {
    createClub(data: {
      name: $name
    }) {
      id
      name
    }
  }
`;

export default function CreateClub() {

  const { inputs, handleChange, clearForm  } = useForm({
    name: '',
  });

  const [createClub, { data, loading, error }] = useMutation(CREATE_CLUB_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CLUBS_GENERAL_QUERY }]
  });

  return (
    <Form onSubmit={ async (e) => {

      e.preventDefault();

      const res = await createClub().catch(console.log);

      console.log(res?.data);
      clearForm();

    }}>

      <DisplayError error={error} />

      <fieldset disabled={loading} aria-busy={loading}>

          <label htmlFor="name">
            Name
            <input
              required
              minLength="3"
              maxLength="25"
              type="text"
              id="name"
              name="name"
              placeholder="Use a unique name and a minimum length of 3 "
              value={inputs.name}
              onChange={handleChange}
              />
          </label>

          <button type="submit">Create Club</button>

      </fieldset>

    </Form>
)}


