// src/hooks/useLockBodyScroll.js
import { useEffect } from 'react';

export const useLockBodyScroll = () => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);
};