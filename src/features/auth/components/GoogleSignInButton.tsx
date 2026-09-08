import { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

export const GoogleSignInButton = ({
  onSuccess,
  disabled = false,
}: GoogleSignInButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '1031061025304-la9pu3ek9u4hq7ilbm0do7013qjcn2n.apps.googleusercontent.com';
    console.log('Google Client ID:', clientId);

    if (!clientId || !buttonRef.current) {
      console.error(
    'VITE_GOOGLE_CLIENT_ID is missing. Google Sign-In cannot be initialized.'
  );
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          }
        },
      });

      buttonRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);

      return () => {
        existingScript.removeEventListener('load', initializeGoogle);
      };
    }

    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [onSuccess]);

  return (
    <div
      className={`w-full ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
      aria-disabled={disabled}
    >
      <div ref={buttonRef} className="flex w-full justify-center" />
    </div>
  );
};