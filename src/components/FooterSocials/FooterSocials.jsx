import React, { lazy, Suspense } from "react";
import Loader from "../../views/Loader/Loader";

const FaFacebookF = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaFacebookF }))
);
const FaInstagram = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaInstagram }))
);
const FaTwitter = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaTwitter }))
);

const socials = [
  { icon: <FaFacebookF />, href: "https://facebook.com" },
  { icon: <FaInstagram />, href: "https://instagram.com" },
  { icon: <FaTwitter />, href: "https://twitter.com" },
];

const FooterSocials = React.memo(({ isRTL = false }) => {
  return (
    <Suspense fallback={<Loader size="small" />}>
      <div className={`flex space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
        {socials.map((s, index) => (
          <a
            key={index}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600  hover:text-primary transition-colors duration-200 text-xl"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </Suspense>
  );
});

export default FooterSocials;
