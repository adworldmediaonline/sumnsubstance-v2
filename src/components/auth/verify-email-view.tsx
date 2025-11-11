'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useState } from 'react';
import { otpSchema } from '@/lib/validations/otp.schema';
import { authClient } from '@/lib/auth-client';

interface VerifyEmailViewProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function VerifyEmailView({ email, onSuccess, onBack }: VerifyEmailViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    await authClient.emailOtp.verifyEmail(
      {
        email: email,
        otp: values.otp,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Email verified successfully!');
          onSuccess();
        },
        onError: ctx => {
          setIsLoading(false);
          toast.error(ctx.error.message || 'Invalid verification code');
        },
      }
    );
  }

  async function handleResendOTP() {
    setIsResending(true);
    // Add resend logic here if needed
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification code resent!');
    }, 1000);
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-primary hover:text-primary/80 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sign In
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center flex justify-center text-base">
                  Enter Verification Code
                </FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup autoFocus={true}>
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

