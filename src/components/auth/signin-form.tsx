'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { signinSchema } from '@/lib/validations/signin.schema';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

interface SignInFormProps extends React.ComponentProps<'div'> {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
  onVerificationNeeded?: (email: string) => void;
  inDialog?: boolean;
}

export function SignInForm({
  className,
  onSuccess,
  onSwitchToSignUp,
  onVerificationNeeded,
  inDialog = false,
  ...props
}: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Sign in successful');
          if (onSuccess) {
            onSuccess();
          }
          if (!inDialog) {
            router.push('/dashboard');
          }
        },
        onError: ctx => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {inDialog ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            id="password"
                            type="password"
                            placeholder="********"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                {inDialog && onSwitchToSignUp ? (
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="underline underline-offset-4 text-primary hover:text-primary/80 font-bold transition-colors bg-transparent"
                  >
                    Sign up
                  </button>
                ) : (
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4 text-primary hover:text-primary/80 font-bold transition-colors bg-transparent"
                  >
                    Sign up
                  </Link>
                )}
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                            </div>
                            <FormControl>
                              <Input
                                {...field}
                                id="password"
                                type="password"
                                placeholder="********"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                  {/* <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/sign-up"
                      className="underline underline-offset-4 text-[hsl(var(--primary))] hover:text-[#1e7a1e] font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </div> */}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      {!inDialog && (
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
          and <a href="#">Privacy Policy</a>.
        </div>
      )}
    </div>
  );
}
