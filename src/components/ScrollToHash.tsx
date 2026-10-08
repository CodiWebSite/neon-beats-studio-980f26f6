import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to #hash after route changes (e.g. /management -> /#contact). */
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 100);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
};
export default ScrollToHash;
