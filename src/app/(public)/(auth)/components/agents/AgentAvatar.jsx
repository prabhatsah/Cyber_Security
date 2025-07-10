import { motion } from 'framer-motion';
import { fadeInScale } from '../../utils/animation';
import { agentProfiles } from './AgentData';
import AgentCard from './AgentCard';

const AgentAvatar = ({ role, color, delay }) => {
  const profile = agentProfiles[role];

  return (
    <motion.div
      {...fadeInScale}
      transition={{ ...fadeInScale.transition, delay }}
      className="absolute"
    >
      <AgentCard
        name={profile.name}
        title={profile.title}
        avatar={profile.avatar}
        color={color}
      />
    </motion.div>
  );
};

export default AgentAvatar;