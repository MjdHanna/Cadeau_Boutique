import React from "react";
const FooterSection = React.memo(({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
export default FooterSection;
