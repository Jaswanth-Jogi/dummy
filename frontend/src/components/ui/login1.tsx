'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const Login1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-sm"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-sm"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default Login1;
