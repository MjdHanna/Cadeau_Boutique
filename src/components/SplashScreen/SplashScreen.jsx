import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/NavBar/a_logo_for_a_gift_app_named_bella_regalo_keep_the_exact_icon_from.png";
import { useTranslation } from "react-i18next";

const SplashScreen = ({ isVisible }) => {
  const { t, i18n } = useTranslation();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
          }}
          transition={{
            duration: 0.8,
          }}
          className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center bg-white"
        >
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full bg-pink-400/20 blur-[100px]"
            animate={{
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.15, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1.4,
                ease: "easeOut",
              }}
            >
              <motion.img
                src={logo}
                alt="Wishly"
                className="w-40 h-40 object-contain"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.2,
              }}
              className="mt-3 text-sm md:text-base tracking-wider text-gray-500 "
            >
              {t("Share Happiness With Every Gift")}
            </motion.p>
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.2,
              }}
              className="mt-3 text-sm md:text-base tracking-wider text-gray-500 "
            >
              {t("Where the wish begins... and the smile is complete.")}
            </motion.p>
            <div className="mt-8 h-[4px] w-[220px] bg-gray-200  rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{
                  width: 0,
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
