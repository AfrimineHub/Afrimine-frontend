import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
      <p className="text-gray-500 text-sm mb-8">Log in to start selling and buying mining equipment</p>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account? 
        <Link to='/auth/register'>
          <span className="text-yellow-600 font-bold cursor-pointer">Sign up here</span>
        </Link>
      </p>
    </>
  );
};
export default LoginPage;