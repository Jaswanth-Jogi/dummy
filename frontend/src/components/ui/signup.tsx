'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from '@/services/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await authService.signUp(email, password);
      if (result.success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        setEmail('');
        setPassword('');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
      <h1 className="text-xl font-semibold">Sign Up</h1>
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
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
