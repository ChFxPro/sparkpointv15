import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../ui/button';

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) throw new Error('Copy command was not available.');
}

export function CopyButton({
  text,
  label,
  copiedLabel = 'Copied',
  className,
  variant = 'outline',
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      await copyText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }

    window.setTimeout(() => setStatus('idle'), 2500);
  };

  return (
    <div className="inline-flex flex-col items-start">
      <Button type="button" variant={variant} className={className} onClick={handleCopy}>
        {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {status === 'copied' ? copiedLabel : label}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'copied' ? `${label} copied to clipboard.` : ''}
        {status === 'error' ? `Unable to copy ${label.toLowerCase()}.` : ''}
      </span>
    </div>
  );
}
