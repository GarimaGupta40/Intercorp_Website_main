import { motion } from 'framer-motion';
import { ShoppingBag, Star, Award, Sparkles, Heart, Shield } from 'lucide-react';
import consumerImg from '../assets/consumer.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function ConsumerProducts() {
  const categories = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Premium supplements and nutritional products supporting overall health',
      products: ['Vitamins & Minerals', 'Herbal Supplements', 'Probiotics', 'Protein Powders'],
    },
    {
      icon: Sparkles,
      title: 'Personal Care',
      description: 'Natural and effective personal care products for daily use',
      products: ['Skincare Products', 'Hair Care', 'Body Care', 'Oral Hygiene'],
    },
    {
      icon: ShoppingBag,
      title: 'Functional Foods',
      description: 'Nutritious food products designed for health-conscious consumers',
      products: ['Energy Bars', 'Protein Snacks', 'Fortified Beverages', 'Healthy Meals'],
    },
  ];

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Carefully selected ingredients meeting highest quality standards',
    },
    {
      icon: Shield,
      title: 'Safety Tested',
      description: 'Rigorously tested for safety and efficacy',
    },
    {
      icon: Star,
      title: 'Customer Trusted',
      description: 'Backed by positive reviews and customer satisfaction',
    },
    {
      icon: Sparkles,
      title: 'Innovation Driven',
      description: 'Continuously developing new and improved products',
    },
  ];

  const values = [
    {
      title: 'Natural Ingredients',
      description:
        'We prioritize natural, sustainably sourced ingredients that are gentle yet effective, avoiding harsh chemicals and synthetic additives.',
    },
    {
      title: 'Transparent Practices',
      description:
        'Complete transparency in our ingredient sourcing, manufacturing processes, and testing procedures, building trust with every product.',
    },
    {
      title: 'Affordable Excellence',
      description:
        'Premium quality products at accessible prices, ensuring everyone can benefit from superior nutrition and wellness solutions.',
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={consumerImg} alt="Consumer Products" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-orange-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Consumer Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Quality products designed for health, wellness, and everyday living
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Product Range"
              subtitle="Comprehensive solutions for modern consumer needs"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <category.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.products.map((product) => (
                    <li key={product} className="flex items-center text-gray-700">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-3" />
                      {product}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Why Choose Our Products"
              subtitle="Commitment to quality and customer satisfaction"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionHeader
              title="Our Commitment"
              subtitle="Values that guide our product development"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader title="Product Development Process" centered />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Research',
                description: 'Identifying consumer needs and market trends',
              },
              {
                step: '02',
                title: 'Formulation',
                description: 'Developing effective and safe product formulas',
              },
              {
                step: '03',
                title: 'Testing',
                description: 'Rigorous quality and safety testing protocols',
              },
              {
                step: '04',
                title: 'Launch',
                description: 'Bringing innovative products to market',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full text-white text-2xl font-bold mb-4">
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
        title="Interested in Our Consumer Products?"
        description="Explore our full range of products or get in touch with our team"
        primaryButtonText="Contact Us"
      />
    </div>
  );
}
