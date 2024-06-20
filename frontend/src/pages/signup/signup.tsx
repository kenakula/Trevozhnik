import { useAuth } from '@shared/hooks/use-auth';
import { Formik, FormikHelpers } from 'formik';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface IFormValues {
  email: string;
  password: string;
}

const Signup = (): ReactElement => {
  const { signup } = useAuth();

  const onSubmit = async ({
    email,
    password
  }: IFormValues, { setSubmitting }: FormikHelpers<IFormValues>): Promise<void> => {
    await signup(email, password);

    setSubmitting(false);
  };

  const initialValues: IFormValues = { email: '', password: '' };

  return (
    <Formik<IFormValues> initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, handleSubmit, values, handleChange }) => (
        <form onSubmit={handleSubmit}>
          <h1>SIGNUP</h1>
          <input type="email" onChange={handleChange} value={values.email} name="email"/>
          <input type="password" onChange={handleChange} value={values.password} name="password"/>
          <button type="submit" disabled={isSubmitting}>submit</button>
          <Link to="/login">login</Link>
          {' '}
          <Link to="/dashboard">dashboard</Link>
        </form>
      )}

    </Formik>
  );
};

export const element = <Signup/>;
