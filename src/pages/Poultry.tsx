import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, Shield, TrendingUp, Leaf, ArrowRight } from 'lucide-react';
import poultryImg from '../assets/poultry.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function Poultry() {
  const [activeTab, setActiveTab] = useState('broilers');

  const sectors = {
    broilers: {
      title: 'Broiler Production',
      description:
        'Optimized nutrition programs for meat-type chickens, focusing on rapid growth, feed efficiency, and meat quality.',
      benefits: [
        'Enhanced growth rates',
        'Improved feed conversion',
        'Better meat yield',
        'Reduced production costs',
      ],
    },
    layers: {
      title: 'Layer Operations',
      description:
        'Specialized feeds for egg-laying hens, maximizing egg production, shell quality, and bird longevity.',
      benefits: [
        'Increased egg production',
        'Superior shell strength',
        'Extended laying cycle',
        'Optimal egg quality',
      ],
    },
    breeders: {
      title: 'Breeder Management',
      description:
        'Premium nutrition for parent stock, ensuring fertility, hatchability, and healthy chick production.',
      benefits: [
        'Higher fertility rates',
        'Better hatchability',
        'Healthy day-old chicks',
        'Improved uniformity',
      ],
    },
  };

  const advantages = [
    {
      icon: Zap,
      title: 'Performance Enhancement',
      description: 'Formulations proven to boost growth rates and production efficiency',
    },
    {
      icon: Shield,
      title: 'Health Support',
      description: 'Immune-boosting ingredients promoting disease resistance and vitality',
    },
    {
      icon: TrendingUp,
      title: 'Economic Efficiency',
      description: 'Optimized feed conversion reducing costs and maximizing profitability',
    },
    {
      icon: Leaf,
      title: 'Sustainable Practices',
      description: 'Environmentally responsible ingredients and reduced environmental impact',
    },
  ];

  const process = [
    {
      title: 'Nutritional Analysis',
      description:
        'Comprehensive assessment of bird requirements based on age, breed, and production goals',
    },
    {
      title: 'Formula Development',
      description:
        'Custom feed formulations using premium ingredients and advanced nutritional science',
    },
    {
      title: 'Quality Manufacturing',
      description:
        'State-of-the-art production facilities ensuring consistent quality and safety',
    },
    {
      title: 'Performance Monitoring',
      description:
        'Ongoing evaluation and adjustment to optimize results and maximize productivity',
    },
  ];

  const solutions = [
    {
      title: 'Starter Feeds',
      description:
        'Critical early nutrition supporting rapid development and establishing strong foundation for growth.',
    },
    {
      title: 'Grower Programs',
      description:
        'Balanced nutrition during growth phase optimizing skeletal development and muscle formation.',
    },
    {
      title: 'Finisher Formulas',
      description:
        'Final stage nutrition maximizing meat yield and quality for market-ready birds.',
    },
    {
      title: 'Specialty Solutions',
      description:
        'Targeted products including probiotics, enzymes, and supplements enhancing overall performance.',
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={poultryImg} alt="Poultry Nutrition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-yellow-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Poultry Nutrition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Advanced feed solutions maximizing performance and profitability in poultry production
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Sectors We Serve" subtitle="Specialized nutrition for every poultry operation" centered />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(sectors).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-amber-600 text-white shadow-lg'
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
                  <ArrowRight className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
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
              title="The Need for Superior Poultry Nutrition"
              subtitle="Meeting the challenges of modern poultry production"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Challenges</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Rising feed costs and market pressures
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Disease management and biosecurity
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Environmental sustainability requirements
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Consumer demand for quality and safety
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
                  Cost-effective formulations maximizing ROI
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Immune-supporting ingredients and additives
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Sustainable practices reducing footprint
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Quality assurance meeting highest standards
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Key Advantages" subtitle="Why producers trust our poultry nutrition" centered />
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <advantage.icon className="w-8 h-8 text-amber-600" />
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
              subtitle="Science-driven approach to poultry nutrition"
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
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full text-white text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-amber-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Featured Solutions" subtitle="Complete product portfolio for every stage" centered />
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
        title="Optimize Your Poultry Production"
        description="Connect with our poultry nutrition experts for customized solutions"
      />
    </div>
  );
}
