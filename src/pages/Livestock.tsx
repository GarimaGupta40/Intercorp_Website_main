import { motion } from 'framer-motion';
import { useState } from 'react';
import { Beef, Heart, Award, Sprout, ArrowRight } from 'lucide-react';
import livestockImg from '../assets/livestock.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function Livestock() {
  const [activeTab, setActiveTab] = useState('cattle');

  const sectors = {
    cattle: {
      title: 'Cattle Nutrition',
      description:
        'Comprehensive feed programs for beef and dairy cattle, optimizing meat production, milk yield, and herd health.',
      benefits: [
        'Enhanced weight gain',
        'Improved milk production',
        'Better feed efficiency',
        'Optimal herd health',
      ],
    },
    swine: {
      title: 'Swine Nutrition',
      description:
        'Precision nutrition for pigs from weaning to market, maximizing growth performance and meat quality.',
      benefits: [
        'Faster growth rates',
        'Superior meat quality',
        'Improved reproduction',
        'Reduced feed costs',
      ],
    },
    sheep: {
      title: 'Sheep & Goats',
      description:
        'Specialized feeds for small ruminants, supporting wool production, meat quality, and reproductive performance.',
      benefits: [
        'Quality wool production',
        'Enhanced meat yield',
        'Better fertility rates',
        'Healthy offspring',
      ],
    },
  };

  const advantages = [
    {
      icon: Beef,
      title: 'Production Excellence',
      description: 'Formulations designed to maximize meat and milk production efficiency',
    },
    {
      icon: Heart,
      title: 'Animal Welfare',
      description: 'Nutrition supporting health, comfort, and natural behavior patterns',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Premium ingredients meeting stringent safety and quality standards',
    },
    {
      icon: Sprout,
      title: 'Sustainability',
      description: 'Environmentally responsible formulations reducing ecological impact',
    },
  ];

  const process = [
    {
      title: 'Herd Assessment',
      description:
        'Detailed evaluation of livestock needs based on breed, age, and production objectives',
    },
    {
      title: 'Custom Formulation',
      description:
        'Tailored nutrition programs using research-backed ingredients and technologies',
    },
    {
      title: 'Quality Production',
      description:
        'Advanced manufacturing ensuring consistent nutrient profiles and palatability',
    },
    {
      title: 'Field Support',
      description:
        'Ongoing technical assistance and program adjustments for optimal performance',
    },
  ];

  const solutions = [
    {
      title: 'Growth Programs',
      description:
        'Balanced nutrition supporting rapid, efficient growth from weaning through finishing stages.',
    },
    {
      title: 'Breeding Nutrition',
      description:
        'Specialized feeds for breeding stock ensuring fertility, conception, and healthy offspring.',
    },
    {
      title: 'Lactation Support',
      description:
        'High-energy formulations optimizing milk production in dairy operations.',
    },
    {
      title: 'Mineral & Supplements',
      description:
        'Targeted supplementation addressing specific nutritional requirements and deficiencies.',
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={livestockImg} alt="Livestock Nutrition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Livestock Nutrition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Proven feed solutions driving productivity and profitability in livestock operations
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Sectors We Serve" subtitle="Complete nutrition across all livestock categories" centered />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(sectors).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-red-600 text-white shadow-lg'
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
                  <ArrowRight className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
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
              title="The Need for Advanced Livestock Nutrition"
              subtitle="Addressing the complexities of modern livestock production"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Challenges</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Volatile commodity prices affecting margins
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Health management and disease prevention
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Environmental regulations and compliance
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Growing demand for sustainable production
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
                  Efficient formulations optimizing feed costs
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Preventive nutrition supporting immunity
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Compliant products meeting regulations
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Sustainable ingredients and practices
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Key Advantages" subtitle="Why ranchers choose our livestock nutrition" centered />
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <advantage.icon className="w-8 h-8 text-red-600" />
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
              subtitle="Data-driven approach to livestock nutrition"
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
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full text-white text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-red-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Featured Solutions" subtitle="Comprehensive products for every production stage" centered />
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
        title="Enhance Your Livestock Operation"
        description="Speak with our livestock nutrition specialists about customized programs"
      />
    </div>
  );
}
