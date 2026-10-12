import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    try {
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.refresh();
      }
    } catch (e) {
      // ignore
    }
  }, [pathname, hash]);

  return null;
}
