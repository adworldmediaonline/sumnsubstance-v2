'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { SignInForm } from './signin-form';
import { SignUpForm } from './signup-form';
import { VerifyEmailView } from './verify-email-view';
import Link from 'next/link';

interface AuthDialogProps {
  trigger: React.ReactNode;
  defaultTab?: 'signin' | 'signup';
}

type ViewState = 'auth' | 'verify';

export function AuthDialog({ trigger, defaultTab = 'signin' }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [verifyEmail, setVerifyEmail] = useState('');

  const handleSuccess = () => {
    setOpen(false);
    setCurrentView('auth'); // Reset to auth view
  };

  const handleVerificationNeeded = (email: string) => {
    setVerifyEmail(email);
    setCurrentView('verify');
  };

  const handleBackToAuth = () => {
    setCurrentView('auth');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[480px] w-[calc(100vw-2rem)] max-h-[90vh] overflow-x-hidden overflow-y-auto p-0 gap-0 bg-white">
        {currentView === 'verify' ? (
          // Verification View
          <>
            <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                Verify Your Email
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                We sent a verification code to {verifyEmail}
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 sm:px-6 py-6">
              <VerifyEmailView
                email={verifyEmail}
                onSuccess={handleSuccess}
                onBack={handleBackToAuth}
              />
            </div>
          </>
        ) : (
          // Auth View
          <>
            <DialogHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm">
                {activeTab === 'signin'
                  ? 'Sign in to your account to continue'
                  : 'Join us and start your natural beauty journey'}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full overflow-hidden"
            >
              <div className="px-4 sm:px-6">
                <TabsList className="grid w-full grid-cols-2 mb-4 mt-4 h-11 bg-muted p-1">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 rounded-md data-[state=active]:shadow-md text-sm sm:text-base"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 rounded-md data-[state=active]:shadow-md text-sm sm:text-base"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="px-4 sm:px-6 pb-4">
                <TabsContent value="signin" className="mt-0">
                  <SignInForm
                    onSuccess={handleSuccess}
                    onSwitchToSignUp={() => setActiveTab('signup')}
                    onVerificationNeeded={handleVerificationNeeded}
                    inDialog
                  />
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <SignUpForm
                    onSuccess={handleSuccess}
                    onSwitchToSignIn={() => setActiveTab('signin')}
                    onVerificationNeeded={handleVerificationNeeded}
                    inDialog
                  />
                </TabsContent>
              </div>

              <div className="px-4 sm:px-6 pb-6 pt-2 border-t">
                <p className="text-xs text-center text-gray-600 break-words">
                  By continuing, you agree to our{' '}
                  <Link href="terms-conditions" className="underline text-primary hover:text-primary/80 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="privacy-policy" className="underline text-primary hover:text-primary/80 transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

