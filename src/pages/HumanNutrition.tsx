import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Sparkles, ArrowRight } from 'lucide-react';
import humanImg from '../assets/human.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function HumanNutrition() {
  const benefits = [
    {
      icon: Heart,
      title: 'Health Optimization',
      description: 'Scientifically formulated to support optimal health and wellness',
    },
    {
      icon: Shield,
      title: 'Safety Certified',
      description: 'Rigorously tested and certified to meet international safety standards',
    },
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'Sourced from premium natural ingredients for maximum efficacy',
    },
    {
      icon: Sparkles,
      title: 'Innovative Formulas',
      description: 'Backed by cutting-edge research and development',
    },
  ];

  const solutions = [
    {
      title: 'Dietary Supplements',
      description:
        'Comprehensive range of vitamins, minerals, and nutritional supplements designed to support overall health and fill dietary gaps.',
      features: ['Multivitamins', 'Omega-3 fatty acids', 'Probiotics', 'Protein powders'],
    },
    {
      title: 'Functional Foods',
      description:
        'Fortified food products that provide health benefits beyond basic nutrition, supporting specific health goals.',
      features: ['Fortified beverages', 'Nutritional bars', 'Enhanced grains', 'Functional snacks'],
    },
    {
      title: 'Clinical Nutrition',
      description:
        'Specialized nutritional solutions for medical and therapeutic applications, supporting recovery and health management.',
      features: [
        'Medical nutrition',
        'Enteral feeding',
        'Disease-specific formulas',
        'Recovery support',
      ],
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Research & Development',
      description: 'Advanced research identifying nutritional needs and developing innovative solutions',
    },
    {
      step: '02',
      title: 'Quality Sourcing',
      description: 'Careful selection of premium ingredients from certified suppliers worldwide',
    },
    {
      step: '03',
      title: 'Manufacturing Excellence',
      description: 'State-of-the-art facilities with stringent quality control processes',
    },
    {
      step: '04',
      title: 'Testing & Certification',
      description: 'Comprehensive testing and third-party certification for safety and efficacy',
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={humanImg} alt="Human Nutrition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Human Nutrition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Premium nutritional solutions supporting human health, wellness, and vitality
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
              <SectionHeader title="Empowering Health Through Nutrition" />
              <div className="mt-6 space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Our human nutrition division is dedicated to developing advanced nutritional
                  solutions that support health, wellness, and quality of life. Through
                  science-based formulations and premium ingredients, we help individuals achieve
                  their health goals.
                </p>
                <p>
                  From dietary supplements to functional foods and clinical nutrition, our
                  comprehensive portfolio addresses diverse nutritional needs across all life
                  stages and health conditions.
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
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Solutions"
              subtitle="Comprehensive nutrition products for every health need"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start text-gray-700">
                      <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Process"
              subtitle="From concept to consumer - ensuring excellence at every step"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Interested in Our Human Nutrition Solutions?"
        description="Let's discuss how we can support your nutritional needs"
      />
    </div>
  );
}
