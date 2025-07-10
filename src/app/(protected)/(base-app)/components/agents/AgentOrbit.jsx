import { motion } from 'framer-motion';
import AgentAvatar from './AgentAvatar';
import { orbitAnimation } from '../../utils/animation';

const AgentOrbit = ({ radius, duration, agents }) => {
  return (
    <motion.div
      {...orbitAnimation(duration)}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {agents.map((agent, index) => {
        const angle = (360 / agents.length) * index;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        return (
          <motion.div
            key={agent.role}
            style={{
              position: 'absolute',
              left: `${radius + x}px`,
              top: `${radius + y}px`,
            }}
            {...orbitAnimation(duration, true)}
          >
            <AgentAvatar {...agent} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AgentOrbit;