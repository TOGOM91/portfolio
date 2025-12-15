import React, { useState } from 'react';
import { Code, Database, Layout, Globe, Server, Cpu } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: React.ReactNode;
}

const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('chart');

  const skills: Skill[] = [
    { name: 'HTML/CSS', level: 90, category: 'Frontend', icon: <Layout size={20} /> },
    { name: 'JavaScript', level: 85, category: 'Frontend', icon: <Code size={20} /> },
    { name: 'React', level: 80, category: 'Frontend', icon: <Code size={20} /> },
    { name: 'Vue.js', level: 75, category: 'Frontend', icon: <Code size={20} /> },
    { name: 'TypeScript', level: 70, category: 'Frontend', icon: <Code size={20} /> },
    { name: 'Node.js', level: 80, category: 'Backend', icon: <Server size={20} /> },
    { name: 'Express', level: 75, category: 'Backend', icon: <Server size={20} /> },
    { name: 'SQL', level: 65, category: 'Backend', icon: <Database size={20} /> },
    { name: 'Responsive Design', level: 85, category: 'Design', icon: <Layout size={20} /> },
    { name: 'UI/UX Principles', level: 80, category: 'Design', icon: <Layout size={20} /> },
    { name: 'Tailwind CSS', level: 85, category: 'Design', icon: <Layout size={20} /> },
    { name: 'Git/GitHub', level: 80, category: 'Tools', icon: <Code size={20} /> },
  ];

  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((skill) => skill.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-purple-600 dark:text-purple-400">Skills</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise in web development.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Skills
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-12 flex justify-center">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeTab === 'chart'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Skill Chart
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeTab === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Skill Grid
            </button>
          </div>
        </div>

        {activeTab === 'chart' && (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {filteredSkills.map((skill, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-purple-600 dark:text-purple-400">{skill.icon}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="skill-bar h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                      data-level={skill.level}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mr-3">
                    {skill.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{skill.name}</h3>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${skill.level}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                  ></div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{skill.category}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
