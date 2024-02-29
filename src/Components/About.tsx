import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn.ts";

const BoxesCore = ({ className, ...rest }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const colors = ["#7F9CF5", "#F9A8D4", "#34D399", "#FCD34D", "#FCA5A5", "#D8B4FE", "#60A5FA", "#818CF8", "#A78BFA"];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      style={{ transform: "translate(-10%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)" }}
      className={cn("absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-[0]", className)}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row-${i}`} className="w-16 h-8 border-l border-slate-700 relative">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{ backgroundColor: getRandomColor(), transition: { duration: 0 } }}
              key={`col-${j}`}
              className="w-16 h-8 border-r border-t border-slate-700 relative"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Boxes = React.memo(BoxesCore);

const typewriterTextLines = [
  "Embracing Ranked Choice Voting: A New Horizon for Democracy.",
  "Ranked Choice Voting (RCV) revolutionizes voting, ensuring a more inclusive and fair electoral process.",
  "In local elections, RCV encourages diverse candidate platforms and promotes voter engagement.",
  "For national elections, it mitigates two-party dominance, fostering a multiparty system that better represents voter preferences.",
  "Our vision: A future where every vote counts and democracy thrives through informed and engaged participation."
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-start pt-20 relative">
      <Boxes className="" />
      <div className="z-50 p-3 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Democracy App
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl text-gray-300 mb-8"
        >
          Explore, Learn, and Vote with Confidence! ✍🏽
        </motion.p>
        {typewriterTextLines.map((line, index) => (
          <TypewriterText key={index} text={line} delay={index * 2} />
        ))}
      </div>
    </div>
  );
};

const TypewriterText = ({ text, delay }) => {
  const animation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay, duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      className="text-white text-lg"
    >
      {text}
    </motion.div>
  );
};

export default About;
