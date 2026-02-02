import { motion } from 'framer-motion';
import { useState } from 'react';
import { Fish, Droplet, TrendingUp, Waves, ArrowRight } from 'lucide-react';
import aquaImg from '../assets/aqua.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function Aquaculture() {
  const [activeTab, setActiveTab] = useState('fish');

  const sectors = {
    fish: {
      title: 'Fish Farming',
      description:
        'Advanced nutrition for finfish species including salmon, tilapia, catfish, and more, optimizing growth and health.',
      benefits: [
        'Improved growth rates',
        'Enhanced feed conversion',
        'Better flesh quality',
        'Reduced waste output',
      ],
    },
    shrimp: {
      title: 'Shrimp Culture',
      description:
        'Specialized feeds for shrimp production, maximizing survival rates, growth performance, and harvest quality.',
      benefits: [
        'Higher survival rates',
        'Faster growth cycles',
        'Superior meat quality',
        'Improved pond conditions',
      ],
    },
    specialty: {
      title: 'Specialty Species',
      description:
        'Custom nutrition solutions for specialty aquatic species including crab, lobster, and ornamental fish.',
      benefits: [
        'Species-specific formulas',
        'Optimal color development',
        'Enhanced reproduction',
        'Healthy populations',
      ],
    },
  };

  const advantages = [
    {
      icon: Fish,
      title: 'Growth Performance',
      description: 'Nutrient-dense formulations maximizing growth and feed efficiency',
    },
    {
      icon: Droplet,
      title: 'Water Quality',
      description: 'Low-waste feeds maintaining optimal water conditions',
    },
    {
      icon: TrendingUp,
      title: 'Economic Returns',
      description: 'Cost-effective solutions improving profitability',
    },
    {
      icon: Waves,
      title: 'Sustainability',
      description: 'Responsible ingredients supporting environmental health',
    },
  ];

  const process = [
    {
      title: 'Species Analysis',
      description:
        'Comprehensive evaluation of nutritional requirements for target aquatic species',
    },
    {
      title: 'Feed Development',
      description:
        'Custom formulation using marine proteins and sustainable ingredients',
    },
    {
      title: 'Precision Manufacturing',
      description:
        'Advanced production creating optimal pellet size, density, and stability',
    },
    {
      title: 'Performance Tracking',
      description:
        'Continuous monitoring and optimization for maximum productivity',
    },
  ];

  const solutions = [
    {
      title: 'Starter Feeds',
      description:
        'High-protein formulations supporting early development and establishing strong growth foundation.',
    },
    {
      title: 'Grower Diets',
      description:
        'Balanced nutrition during growth phase optimizing feed conversion and development.',
    },
    {
      title: 'Finisher Programs',
      description:
        'Final stage nutrition maximizing size and quality for market harvest.',
    },
    {
      title: 'Broodstock Nutrition',
      description:
        'Specialized feeds for breeding stock ensuring fertility and healthy offspring production.',
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={aquaImg} alt="Aquaculture Nutrition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-blue-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Aquaculture Nutrition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Advanced aquatic feed solutions supporting sustainable and profitable aquaculture
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Sectors We Serve" subtitle="Specialized nutrition for diverse aquatic species" centered />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(sectors).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {sector.title}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-xl"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {sectors[activeTab as keyof typeof sectors].title}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {sectors[activeTab as keyof typeof sectors].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectors[activeTab as keyof typeof sectors].benefits.map((benefit) => (
                <div key={benefit} className="flex items-center text-gray-700">
                  <ArrowRight className="w-5 h-5 text-cyan-600 mr-3 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              title="The Need for Superior Aquaculture Nutrition"
              subtitle="Meeting the demands of sustainable aquatic farming"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Challenges</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Water quality management and waste control
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Disease outbreaks and health management
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Environmental sustainability requirements
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  Growing demand for quality seafood
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solutions</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Low-waste feeds maintaining water quality
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Immune-supporting nutrition and additives
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Sustainable marine ingredients
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Quality assurance for premium products
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Key Advantages" subtitle="Why aquaculture producers trust our feeds" centered />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                  <advantage.icon className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              title="Process & Technology"
              subtitle="Innovation-driven aquaculture nutrition"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full text-white text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-cyan-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Featured Solutions" subtitle="Complete feed portfolio for all life stages" centered />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Advance Your Aquaculture Operation"
        description="Consult with our aquaculture nutrition experts for tailored solutions"
      />
    </div>
  );
}
