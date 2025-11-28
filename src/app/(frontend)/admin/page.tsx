'use client';

import { SignInForm } from '@/components/auth/signin-form';
import { SignUpForm } from '@/components/auth/signup-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in or create an account to access the admin dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-muted p-1">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 rounded-md data-[state=active]:shadow-md"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 rounded-md data-[state=active]:shadow-md"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              <SignInForm
                onSuccess={handleSuccess}
                onSwitchToSignUp={() => setActiveTab('signup')}
                inDialog={false}
              />
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <SignUpForm
                onSuccess={handleSuccess}
                onSwitchToSignIn={() => setActiveTab('signin')}
                inDialog={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

