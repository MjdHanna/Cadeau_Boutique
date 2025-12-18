import React, { Suspense } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/images/authentication/p1.png";
import Loader from "../../views/Loader/Loader";
import { useTranslation } from "react-i18next";
const FooterSection = React.lazy(() =>
  import("../../components/FooterSection/FooterSection")
);
const FooterSocials = React.lazy(() =>
  import("../../components/FooterSocials/FooterSocials")
);
const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const sections = [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Shop", href: "/" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/Contact" },
        { label: "FAQ", href: "/" },
        { label: "Privacy Policy", href: "/" },
      ],
    },
  ];
  return (
    <footer className=" py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-1 flex flex-col items-center md:items-start"
        >
          <img
            src={logo}
            alt="Logo"
            loading="lazy"
            className="w-auto h-12 transition-transform duration-300 hover:scale-110"
          />
          <p className="text-gray-600 text-center md:text-left">
            {t("Elevate your style with our exclusive gifts collections.")}
          </p>
        </motion.div>
        <Suspense fallback={<Loader />}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <FooterSection
                title={t(section.title)}
                links={section.links.map((link) => ({
                  ...link,
                  label: t(link.label),
                }))}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              {t("Follow Us")}
            </h3>
            <FooterSocials />
          </motion.div>
        </Suspense>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} {t("All Rights Reserved.")}
      </div>
    </footer>
  );
};

export default Footer;
