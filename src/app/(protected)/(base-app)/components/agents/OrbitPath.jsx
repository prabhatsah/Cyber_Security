import { motion } from 'framer-motion';
import { orbitAnimation } from '../../utils/animation';

const OrbitPath = ({ radius, duration }) => (
  <motion.circle
    cx="50%"
    cy="50%"
    r={radius}
    fill="none"
    stroke="rgba(99, 102, 241, 0.2)"
    strokeWidth="1"
    strokeDasharray="4 4"
    {...orbitAnimation(duration)}
  />
);

export default OrbitPath;