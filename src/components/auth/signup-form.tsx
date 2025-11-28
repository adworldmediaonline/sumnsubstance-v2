'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { signupSchema } from '@/lib/validations/signup.schema';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

interface SignUpFormProps extends React.ComponentProps<'div'> {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
  onVerificationNeeded?: (email: string) => void;
  inDialog?: boolean;
}

export function SignUpForm({
  className,
  onSuccess,
  onSwitchToSignIn,
  onVerificationNeeded,
  inDialog = false,
  ...props
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: `/verify-email?email=${encodeURIComponent(values.email)}`,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Verification code sent to your email');
          // If in dialog and verification callback exists, show verification view
          if (inDialog && onVerificationNeeded) {
            onVerificationNeeded(values.email);
          } else {
            // Otherwise redirect to verify email page
            router.push(
              `/verify-email?email=${encodeURIComponent(values.email)}`
            );
          }
        },
        onError: ctx => {
          console.log(ctx);
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
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          id="name"
                          type="text"
                          placeholder="John Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  {isLoading ? 'Signing up...' : 'Sign up'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{' '}
                {inDialog && onSwitchToSignIn ? (
                  <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="underline underline-offset-4 text-primary hover:text-primary/80 font-bold transition-colors bg-transparent"
                  >
                    Sign in
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4 text-primary hover:text-primary/80 font-bold transition-colors bg-transparent"
                  >
                    Sign in
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
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Name</FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              id="name"
                              type="text"
                              placeholder="John Doe"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                      {isLoading ? 'Signing up...' : 'Sign up'}
                    </Button>
                  </div>
                  {/* <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4 text-primary hover:text-primary/80 font-bold transition-colors"
                    >
                      Sign in
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
