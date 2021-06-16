import Form from "./styles/Form";
import useForm from '../lib/useForm';
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";
import DisplayError from "./ErrorMessage";
import { BH } from "./Header";


const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION($email: String!, $password: String!, $name: String!, $clubId: ID!) {
    createUser(data: {
      name: $name
      password: $password
      email: $email
      club: {
        connect: {
          id: $clubId
        }
      }
    }) {
      id
      name
      email
      club {
        id
        name
      }
    }
  }
`;

const ANONYMOUS_CLUB_QUERY = gql`
  query {
    allClubs(where:{
      name: "Anonymous"
    }) {
      id
    }
  }
`;

export default function SignUp() {

  const { inputs, handleChange, clearForm, resetForm } = useForm({
    email: '',
    name: '',
    password: ''
  });

  const {data: ad, loading: lr, error: er} = useQuery(ANONYMOUS_CLUB_QUERY);

  const [signup, { data, loading, error }] = useMutation(SIGN_UP_MUTATION, {
    variables: {
      ...inputs,
      clubId: ad?.allClubs[0].id
    }
  });

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(inputs)
    console.log("signup base club");
    console.log(ad?.allClubs[0].id);

    if(!ad?.allClubs[0].id) {
      return alert("Error signing you up ! No default club created yet (in the backend)");
    }

    const res = await signup().catch(console.err);

    console.log(res)
    resetForm()
  }

  if(lr)
    return <p> Loading ....</p>

  return <Form method="POST" onSubmit={handleSubmit}>
    <fieldset disabled={loading} aria-busy={loading}>
      <BH>Sign Up for an account !</BH>

      <DisplayError error={ error } />

      {
        data?.createUser && (
          <p>
            Signed up with { data.createUser.email } ! - Please go ahead and sign in !
          </p>
        )
      }

      <label htmlFor="name">
        Name
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          autoComplete="name"
          value={inputs.name}
          onChange={ handleChange }/>
      </label>


      <label htmlFor="email">
        Email
        <input
          type="email"
          name="email"
          placeholder="Your Email Address"
          autoComplete="email"
          value={inputs.email}
          onChange={ handleChange }/>
      </label>

      <label htmlFor="password">
        Password
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="password"
          value={inputs.password}
          onChange={ handleChange }/>
      </label>

      <button type="submit">Sign Up</button>

    </fieldset>
  </Form>
}