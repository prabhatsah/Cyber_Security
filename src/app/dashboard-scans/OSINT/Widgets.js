import { motion } from "framer-motion";

const Widget = ({ title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className={`p-6 rounded-lg shadow-lg ${color} text-white`}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default function Widgets({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Widget title="Emails Found" value={data.emails?.length || 0} color="bg-blue-600" />
      <Widget title="Subdomains Found" value={data.hosts?.length || 0} color="bg-green-600" />
      <Widget title="Virtual Hosts" value={data.virtualHosts?.length || 0} color="bg-yellow-500" />
      <Widget title="IP Addresses Found" value={data.ips?.length || 0} color="bg-red-600" />
    </div>
  );
}
