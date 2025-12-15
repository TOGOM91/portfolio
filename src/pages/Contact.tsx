// Contact.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import emailjs from 'emailjs-com';

const Contact: React.FC = () => {
  // Variants for the global animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  // Variants for each form element
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.6, 0.05, 0, 0.9] },
    },
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Remplacez ces valeurs par vos identifiants réels EmailJS
    const serviceID = 'service_5mnv6y8';
    const templateID = 'template_2jl4i3d';
    const userID = '3wD8wVkPeIx5tq_AC';

    emailjs.sendForm(serviceID, templateID, e.currentTarget, userID)
      .then(
        (result: any) => {
          alert('Message sent successfully!');
        },
        (error: any) => {
          alert('An error occurred, please try again.');
          console.error('EmailJS error:', error);
        }
      );
      
    // Optionnel : on peut réinitialiser le formulaire après l'envoi
    e.currentTarget.reset();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        {/* Title & Subtitle */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contact <span className="text-purple-600 dark:text-purple-400">Me</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Feel free to reach out for collaborations or just a friendly hello!
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
        >
          {/* Field: from_name (correspond à {{from_name}} dans EmailJS) */}
          <motion.div variants={itemVariants} className="mb-6">
            <label
              htmlFor="from_name"
              className="block text-gray-900 dark:text-gray-200 font-semibold mb-2"
            >
              Name
            </label>
            <input
              id="from_name"
              name="from_name"
              required
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-md focus:outline-none border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </motion.div>

          {/* Field: from_email (correspond à {{from_email}} dans EmailJS) */}
          <motion.div variants={itemVariants} className="mb-6">
            <label
              htmlFor="from_email"
              className="block text-gray-900 dark:text-gray-200 font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="from_email"
              name="from_email"
              required
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-md focus:outline-none border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </motion.div>

          {/* Field: message (correspond à {{message}} dans EmailJS) */}
          <motion.div variants={itemVariants} className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-900 dark:text-gray-200 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-md focus:outline-none border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="text-center mt-8">
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              Send Message
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </motion.form>

        {/* CTA Back to Home */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            Back to Home
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
