'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeClosedIcon, ChatBubbleIcon, PersonIcon } from '@radix-ui/react-icons';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY as string;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    
    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current as HTMLFormElement,
        EMAILJS_PUBLIC_KEY
      );
      
      if (result.text === 'OK') {
        setFormSubmitted(true);
        setFormData({ user_name: '', user_email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('Failed to send your message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative" style={{ backgroundColor: 'var(--nav-bg)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent bottom-20 -left-48 blur-3xl"></div>
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-l from-green-500/10 to-transparent top-20 -right-48 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-lg font-mono mb-2" style={{ color: 'var(--accent-primary)' }}>Get In Touch</h2>
          <h3 className="text-4xl font-bold mb-4 text-white">Contact Me</h3>
          <p className="text-white/70 max-w-lg mx-auto">
            Have a project in mind or want to discuss a potential opportunity? I&apos;d love to hear from you!
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div 
              className="md:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Contact Information</h4>
                <p className="text-white/70 mb-6">
                  Feel free to reach out through the form or directly via email or social media.
                </p>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 rounded-full bg-white/10">
                    <EnvelopeClosedIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium">Email</h5>
                    <p className="text-white/70">ciaran.t.day@gmail.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 rounded-full bg-white/10">
                    <ChatBubbleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium">Social</h5>
                    <div className="flex gap-2 mt-1">
                      <a href="https://github.com/CiaranGames" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">GitHub</a>
                      <span className="text-white/40">•</span>
                      <a href="https://www.linkedin.com/in/ciaran-day/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">LinkedIn</a>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="p-6 rounded-lg"
                style={{ backgroundColor: 'var(--card-bg)' }}
                whileHover={{ y: -5 }}
              >
                <h4 className="text-white font-semibold mb-2">Let&apos;s Build Something Amazing</h4>
                <p className="text-white/70 text-sm">
                  I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              className="md:col-span-3 p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: 'var(--card-bg)' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              {formSubmitted ? (
                <motion.div 
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </motion.div>
                  <h4 className="text-2xl font-bold mb-2 text-white">Thank You!</h4>
                  <p className="text-white/70 mb-4">
                    Your message has been sent successfully. I&apos;ll get back to you as soon as possible!
                  </p>
                  <motion.button
                    onClick={() => setFormSubmitted(false)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {errorMessage}
                    </div>
                  )}
                
                  <div>
                    <label htmlFor="user_name" className="block text-white/70 mb-2 text-sm">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PersonIcon className="h-5 w-5 text-white/50" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        id="user_name"
                        name="user_name" 
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white transition"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="user_email" className="block text-white/70 mb-2 text-sm">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeClosedIcon className="h-5 w-5 text-white/50" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="email"
                        id="user_email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white transition"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white/70 mb-2 text-sm">Message</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-white transition"
                      placeholder="Your Message"
                    />
                  </div>
                  
                  {/* Hidden fields - these help EmailJS know where to send the email */}
                  <input type="hidden" name="to_email" value="ciaran.t.day@gmail.com" />
                  <input type="hidden" name="reply_to" value={formData.user_email} />
                  
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 transition-colors shadow-lg disabled:opacity-70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : "Send Message"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 