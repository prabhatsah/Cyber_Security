import { motion } from 'framer-motion';
import { particleAnimation } from '../../utils/animation';

const Particle = () => (
  <motion.div
    className="absolute w-1 h-1 bg-indigo-400 rounded-full"
    {...particleAnimation()}
  />
);

export default Particle;