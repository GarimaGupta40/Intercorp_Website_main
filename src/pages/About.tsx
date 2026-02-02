import { motion } from 'framer-motion';
import { Eye, Target, Heart, Shield, Users, Globe } from 'lucide-react';
import aboutHeroImg from '../assets/hero.png';
import humanImg from '../assets/human.jpg';
import animalImg from '../assets/animal.jpg';
import consumerImg from '../assets/consumer.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';
import { Link } from 'react-router-dom';

export default function About() {
  const philosophies = [
    {
      icon: Heart,
      title: 'Customer-Centric',
      description:
        'We prioritize understanding and exceeding our customers needs through personalized solutions.',
    },
    {
      icon: Shield,
      title: 'Integrity & Trust',
      description:
        'Building lasting relationships through transparency, honesty, and ethical business practices.',
    },
    {
      icon: Users,
      title: 'Collaborative Approach',
      description:
        'Fostering partnerships and teamwork to achieve shared success and mutual growth.',
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description:
        'Committed to environmental responsibility and sustainable practices in all operations.',
    },
  ];

  const expertise = [
    {
      title: 'Human Nutrition',
      image: humanImg,
      description: 'Advanced nutritional solutions supporting human health and wellness',
      link: '/human-nutrition',
    },
    {
      title: 'Animal Nutrition',
      image: animalImg,
      description: 'Comprehensive feed programs for optimal animal health and productivity',
      link: '/animal-nutrition',
    },
    {
      title: 'Consumer Products',
      image: consumerImg,
      description: 'Quality products designed to meet everyday consumer needs',
      link: '/consumer-products',
    },
  ];

  return (
    <div>
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHeroImg} alt="About Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Journey & Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Building a healthier world through innovation and excellence
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader title="About INTERCORP" />
              <div className="mt-6 space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  For over three decades, INTERCORP has been at the forefront of nutrition
                  innovation, delivering comprehensive solutions across human nutrition, animal
                  feed, and consumer products.
                </p>
                <p>
                  Our journey began with a simple vision: to improve lives through better
                  nutrition. Today, we serve thousands of clients worldwide, combining scientific
                  expertise with practical application to create products that make a real
                  difference.
                </p>
                <p>
                  From our state-of-the-art research facilities to our global distribution network,
                  every aspect of our operation reflects our commitment to quality, innovation, and
                  sustainability.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
                <div className="text-gray-700 font-semibold">Years of Excellence</div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-700 font-semibold">Countries Served</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl">
                <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-gray-700 font-semibold">Products Developed</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">5000+</div>
                <div className="text-gray-700 font-semibold">Satisfied Clients</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To be the global leader in nutrition solutions, advancing health and wellness
                across human and animal sectors through relentless innovation, uncompromising
                quality, and sustainable practices that benefit our customers, communities, and the
                planet.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To create a world where optimal nutrition is accessible to all, empowering
                healthier lives and sustainable growth. We envision a future where our innovations
                set industry standards and our partnerships drive positive change across global
                communities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Core Philosophies"
              subtitle="The principles that guide everything we do"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {philosophies.map((philosophy, index) => (
              <motion.div
                key={philosophy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                  <philosophy.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{philosophy.title}</h3>
                <p className="text-gray-600">{philosophy.description}</p>
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
              subtitle="Specialized solutions across key sectors"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.link}
                  className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
