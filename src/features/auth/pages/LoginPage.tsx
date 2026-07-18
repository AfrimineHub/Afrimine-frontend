import { LoginForm } from '../components/LoginForm';
const LoginPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
      <p className="text-gray-500 text-sm mb-8">Log in to manage equipment listings or buy on Afrimine</p>
      <LoginForm />
    </>
  );
};
export default LoginPage;