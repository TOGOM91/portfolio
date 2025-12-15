import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Award, BookOpen, Briefcase, Heart, Coffee, Code, Music, Gamepad2, Trophy } from 'lucide-react';
import gsap from 'gsap';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'education' | 'work' | 'achievement';
}

const About: React.FC = () => {
  const [timelineRef, timelineInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Updated timeline items reflecting Tom Farge's journey
  const timelineItems: TimelineItem[] = [
    {
      year: '2023',
      title: 'Began Higher Education',
      description: 'Started my studies in Computer Science, diving deep into web development and modern technologies.',
      icon: <BookOpen size={20} />,
      category: 'education',
    },
    {
      year: '2022',
      title: 'Discovered My Passion',
      description: 'Realized my love for coding, new technologies, video games, sports, and exploring the universe.',
      icon: <Trophy size={20} />,
      category: 'achievement',
    },
    {
      year: '2020',
      title: 'First Coding Experiment',
      description: 'Started learning HTML, CSS, and JavaScript, sparking a journey into the world of development.',
      icon: <Calendar size={20} />,
      category: 'education',
    },
    {
      year: '2019',
      title: 'Exploring Technology',
      description: 'Began experimenting with various programming languages and discovered the endless possibilities of technology.',
      icon: <Code size={20} />,
      category: 'achievement',
    },
  ];

  // Updated fun facts reflecting your interests
  const funFacts = [
    { icon: <Coffee size={20} />, text: 'I fuel my coding sessions with a strong cup of coffee.' },
    { icon: <Gamepad2 size={20} />, text: 'I love playing video games and exploring indie titles.' },
    { icon: <Heart size={20} />, text: 'I am passionate about sports and keeping active.' },
    { icon: <Music size={20} />, text: 'I enjoy listening to music that inspires creativity during development.' },
    { icon: <Code size={20} />, text: 'I experiment with new tech trends and love building fun projects.' },
    { icon: <Calendar size={20} />, text: 'I’m always curious about the universe and the latest in innovation.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    if (timelineInView) {
      gsap.to('.timeline-line', {
        height: '100%',
        duration: 1.5,
        ease: 'power3.out',
      });

      gsap.to('.timeline-item', {
        opacity: 1,
        x: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }
  }, [timelineInView]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-purple-600 dark:text-purple-400">Tom Farge</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover my journey, my passion for development, and the interests that drive me.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-20">
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md p-6 md:p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              My Story
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Hello! I'm Tom Farge, a passionate developer whose love for coding began when I started my higher education last year. 
              </p>
              <p>
                Ever since I was young, I've been captivated by new technologies, immersive video games, and the excitement of exploring the unknown—from the world of sports to the mysteries of the universe.
              </p>
              <p>
                My journey in web development has been fueled by curiosity and a desire to create interactive digital experiences. Whether I'm experimenting with new frameworks or building small projects on weekends, I strive to combine creativity with technical precision.
              </p>
              <p>
                Feel free to ask me any questions or share your thoughts—I'm always excited to connect with fellow tech enthusiasts!
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md p-6 md:p-8 h-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Fun Facts About Me
            </h2>
            <div className="space-y-4">
              {funFacts.map((fact, index) => (
                <motion.div key={index} variants={itemVariants} className="flex items-start">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mr-4 mt-1">
                    {fact.icon}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{fact.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-purple-600 dark:text-purple-400">Journey</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            A timeline of the milestones that have shaped my career and passions.
          </p>
        </motion.div>

        <div ref={timelineRef} className="relative max-w-3xl mx-auto px-4 pb-12">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1">
            <div className="timeline-line h-0 w-full bg-gradient-to-b from-purple-600 to-blue-500 rounded-full"></div>
          </div>

          {/* Timeline items */}
          {timelineItems.map((item, index) => (
            <div
              key={index}
              className={`timeline-item opacity-0 relative mb-12 ${
                index % 2 === 0 ? 'translate-x-12' : '-translate-x-12'
              }`}
            >
              <div className={`flex items-start ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div
                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
                      index % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center mb-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                      <Calendar size={16} className="mr-1" />
                      {item.year}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-4 border-purple-600 dark:border-purple-500 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400">
                      {item.icon}
                    </span>
                  </div>
                </div>

                <div className="w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
