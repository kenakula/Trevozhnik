import { useAuth } from '@shared/hooks/use-auth';
import { Formik, FormikHelpers } from 'formik';
import { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface IFormValues {
  email: string;
  password: string;
}

const Login = (): ReactElement => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async ({
    email,
    password
  }: IFormValues, { setSubmitting }: FormikHelpers<IFormValues>): Promise<void> => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('ERROR: login page: ', err);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: IFormValues = { email: '', password: '' };

  return (
    <Formik<IFormValues> initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, handleSubmit, values, handleChange }) => (
        <form onSubmit={handleSubmit}>
          <h1>LOGIN</h1>
          <input type="email" onChange={handleChange} value={values.email} name="email"/>
          <input type="password" onChange={handleChange} value={values.password} name="password"/>
          <button type="submit" disabled={isSubmitting}>submit</button>
          <Link to="/signup">signup</Link>
          {' '}
          <Link to="/dashboard">dashboard</Link>
        </form>
      )}
    </Formik>
  );
};

export const element = <Login/>;
