import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Lapo from '../lapocombinate_1.png'; 
import Antidote from '../logo-antidote.png'; 
import Secstaff from '../logo-secstaff.png';
import Bd from '../premiere_couv.png'; 
import CKC from '../kim-chandler.jpg'; 
import Diez from '../diez.jpg';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: "L'Antidote",
      description:
        "A website for a Corsican-Italian restaurant built using HTML, CSS, and native JavaScript.",
      image: Antidote,
      tags: ['HTML', 'CSS', 'JavaScript'],
      demoUrl: 'https://www.lantidotepizza.fr/',
      githubUrl: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Secstaff Website',
      description:
        "Corporate website for Secstaff, a staffing company, developed with WordPress.",
      image: Secstaff,
      tags: ['WordPress'],
      demoUrl: 'https://www.secstaff.com/',
      githubUrl: '#',
      featured: true,
    },
    {
      id: 3,
      title: "Les Architectes de l'Opinion",
      description:
        "A podcast project website built using HTML, CSS, and native JavaScript.",
      image: Lapo,
      tags: ['HTML', 'CSS', 'JavaScript'],
      demoUrl: '#',
      githubUrl: '#',
      featured: false,
    },
    {
      id: 4,
      title: 'Comic Presentation Website',
      description:
        "A website to showcase a comic book project, developed with PHP, HTML, and CSS.",
      image: Bd,
      tags: ['PHP', 'HTML', 'CSS'],
      demoUrl: '#',
      githubUrl: '#',
      featured: false,
    },
    {
      id: 5,
      title: 'Kim Chandler Client Case',
      description:
        "Developed two WordPress websites for Kim Chandler: 'Diez Creative' and 'Kim Chandler Consulting'.",
      image: CKC,
      tags: ['WordPress'],
      demoUrl: '#',
      githubUrl: '#',
      featured: true,
    },
    {
      id: 6,
      title: 'Diez Creative',
      description:
        "A wordpress website for Kim (creator of Kim Chandler)",
      image: Diez,
      tags: ['HTML', 'CSS', 'JavaScript', 'API'],
      demoUrl: '#',
      githubUrl: '#',
      featured: false,
    },
  ];

  const filteredProjects =
    filter === 'all'
      ? projects
      : filter === 'featured'
      ? projects.filter((project) => project.featured)
      : projects.filter((project) => project.tags.includes(filter));

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  );

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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            My <span className="text-purple-600 dark:text-purple-400">Projects</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my latest work and projects that showcase my skills and expertise in web development.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              filter === 'featured'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Featured
          </button>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                filter === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  style={{
                    transform: hoveredProject === project.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-purple-600/80 text-white rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  {project.demoUrl !== '#' ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                    >
                      Live Demo <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium">
                      Demo coming soon
                    </span>
                  )}
                  {project.githubUrl !== '#' ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-gray-700 dark:text-gray-300 font-medium">
                      GitHub coming soon
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            View All Projects on GitHub <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
