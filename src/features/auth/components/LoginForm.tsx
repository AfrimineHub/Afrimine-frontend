import { Input } from '../components/inputs/Input';
import { Button } from '../components/buttons/Button';

export const LoginForm = () => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <Input label="Email" placeholder="Input your email" type="email" />
      <div className="relative">
        <Input label="Password" placeholder="Input your password" type="password" />
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-yellow-500" /> Remember me
        </label>
        <a href="#" className="hover:text-yellow-600">Forgot Password?</a>
      </div>

      <Button type="submit">Login</Button>
      
      <div className="text-center py-2 text-gray-400 text-xs">Or Continue with</div>
      <Button variant="outline">Signup with Google</Button>
    </form>
  );
};