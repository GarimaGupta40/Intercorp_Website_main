import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import animalImg from '../assets/animal.jpg';
import poultryImg from '../assets/poultry.jpg';
import livestockImg from '../assets/livestock.jpg';
import aquaImg from '../assets/aqua.jpg';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';

export default function AnimalNutrition() {
  const categories = [
    {
      title: 'Poultry Nutrition',
      description:
        'Specialized feed solutions optimizing growth, egg production, and overall health in broilers, layers, and breeders.',
      image: poultryImg,
      link: '/animal-nutrition/poultry',
      color: 'from-yellow-500 to-amber-600',
      highlights: ['Broiler feeds', 'Layer feeds', 'Breeder nutrition', 'Performance optimization'],
    },
    {
      title: 'Livestock Nutrition',
      description:
        'Comprehensive feed programs for cattle, swine, and other livestock, maximizing productivity and animal welfare.',
      image: livestockImg,
      link: '/animal-nutrition/livestock',
      color: 'from-red-500 to-red-600',
      highlights: ['Cattle nutrition', 'Swine feeds', 'Dairy solutions', 'Growth optimization'],
    },
    {
      title: 'Aquaculture Nutrition',
      description:
        'Advanced aquatic feed solutions supporting sustainable fish farming and optimal growth in various aquatic species.',
      image: aquaImg,
      link: '/animal-nutrition/aquaculture',
      color: 'from-cyan-500 to-blue-600',
      highlights: ['Fish feeds', 'Shrimp nutrition', 'Water quality', 'Growth performance'],
    },
  ];

  return (
    <div>
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={animalImg} alt="Animal Nutrition" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Animal Nutrition
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Comprehensive feed solutions optimizing health, productivity, and sustainability across
            all animal sectors
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              title="Complete Nutrition Solutions"
              subtitle="Expert feed programs tailored to the unique needs of each animal category"
              centered
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 bg-white p-8 rounded-2xl shadow-lg"
          >
            <p className="text-lg text-gray-600 leading-relaxed">
              Our animal nutrition division combines decades of research, advanced nutritional
              science, and practical experience to deliver feed solutions that enhance animal
              health, maximize productivity, and support sustainable farming practices. We serve
              farmers, integrators, and feed mills worldwide with customized nutrition programs.
            </p>
          </motion.div>

          <div className="space-y-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={category.link}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-80 md:h-auto overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-50 transition-opacity`}
                      />
                    </div>

                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h3>
                      <p className="text-gray-600 text-lg mb-6">{category.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {category.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center text-gray-700 text-sm font-medium"
                          >
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                            {highlight}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center text-green-600 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                        Explore {category.title}
                        <ArrowRight className="ml-2 w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              title="Why Choose Our Animal Nutrition Solutions"
              subtitle="Advantages that set us apart in animal feed innovation"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scientific Excellence</h3>
              <p className="text-gray-600">
                Our team of nutritionists and veterinarians develops evidence-based formulations
                backed by rigorous research and field trials.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customized Programs</h3>
              <p className="text-gray-600">
                Tailored nutrition strategies addressing specific needs, climate conditions, and
                production goals for optimal results.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Support</h3>
              <p className="text-gray-600">
                Dedicated field support team providing ongoing guidance, training, and optimization
                services to maximize success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Optimize Your Animal Nutrition Program?"
        description="Connect with our experts to discuss customized feed solutions"
      />
    </div>
  );
}
