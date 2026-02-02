import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Lightbulb, Award, Users } from 'lucide-react';
import { useEffect } from 'react';
import heroImg from '../assets/hero.png';
import humanImg from '../assets/human.jpg';
import animalImg from '../assets/animal.jpg';
import consumerImg from '../assets/consumer.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Stay on Home, but this ensures we handle any unintended redirects back
    }
  }, []);

  const verticals = [
    {
      title: 'Human Nutrition',
      description: 'Premium nutritional solutions for human health and wellness',
      image: humanImg,
      link: '/human-nutrition',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Animal Nutrition',
      description: 'Comprehensive feed solutions for livestock, poultry, and aquaculture',
      image: animalImg,
      link: '/animal-nutrition',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Consumer Products',
      description: 'Quality products designed for everyday consumer needs',
      image: consumerImg,
      link: '/consumer-products',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const whyPartner = [
    {
      icon: Target,
      title: 'Industry Expertise',
      description: 'Decades of experience in nutrition science and product development',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Cutting-edge solutions backed by research and development',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous testing and compliance with international standards',
    },
    {
      icon: Users,
      title: 'Partnership Approach',
      description: 'Collaborative relationships focused on mutual success',
    },
  ];

  return (
    <div>
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Nutrition Solutions for Every Need
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Leading the industry with innovative nutrition solutions across human health, animal
            feed, and consumer products. We are dedicated to providing the best quality products for our customers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg group"
            >
              Discover Our Story
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Business Verticals"
              subtitle="Comprehensive nutrition solutions tailored to diverse industry needs"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {verticals.map((vertical, index) => (
              <motion.div
                key={vertical.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={vertical.link}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={vertical.image}
                      alt={vertical.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${vertical.color} opacity-60 group-hover:opacity-70 transition-opacity`}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{vertical.title}</h3>
                    <p className="text-gray-600 mb-4">{vertical.description}</p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Learn More
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Why Partner With Us"
              subtitle="Building success through expertise, innovation, and commitment to excellence"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyPartner.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Expertise"
              subtitle="Delivering specialized solutions across multiple sectors"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Research & Development</h3>
              <p className="text-gray-600 mb-4">
                State-of-the-art facilities and expert teams dedicated to advancing nutrition
                science and developing breakthrough solutions.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Advanced laboratory testing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Clinical trials and studies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Product innovation
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Control</h3>
              <p className="text-gray-600 mb-4">
                Stringent quality assurance processes ensuring every product meets the highest
                standards of safety and efficacy.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  ISO certified processes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Regular audits
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Traceability systems
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 mb-4">
                Extensive distribution network and partnerships enabling us to serve clients across
                continents with reliable supply chains.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  International presence
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Local expertise
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  24/7 support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
