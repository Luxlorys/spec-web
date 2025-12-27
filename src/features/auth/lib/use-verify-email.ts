'use client';

import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { authApi } from 'shared/api';
import { showApiError } from 'shared/lib';

const CODE_LENGTH = 6;

export const useVerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);

    try {
      await authApi.verifyEmail(verificationCode);
      setVerified(true);
      // Redirect to login after short delay
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      showApiError(err);
      // Clear the code on error
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    if (sanitized.length <= 1) {
      const newCode = [...code];

      newCode[index] = sanitized;
      setCode(newCode);

      // Move to next input if value entered
      if (sanitized && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      const fullCode = newCode.join('');

      if (fullCode.length === CODE_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    if (pastedData) {
      const newCode = [...code];

      pastedData.split('').forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);

      // Focus on the next empty input or last input
      const nextEmptyIndex = newCode.findIndex(c => !c);
      const focusIndex =
        nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;

      inputRefs.current[focusIndex]?.focus();

      // Auto-submit if complete
      if (pastedData.length === CODE_LENGTH) {
        handleVerify(pastedData);
      }
    }
  };

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setIsResending(true);
    setResent(false);

    try {
      await authApi.resendVerification(email);
      setResent(true);
      // Clear the code
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      showApiError(err);
    } finally {
      setIsResending(false);
    }
  };

  return {
    email,
    code,
    isVerifying,
    isResending,
    resent,
    verified,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
    CODE_LENGTH,
  };
};
