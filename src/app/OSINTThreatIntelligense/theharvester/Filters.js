export default function Filters({ data }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <div className="flex space-x-4">
          <input type="text" placeholder="Filter by Email" className="p-2 border rounded" />
          <input type="text" placeholder="Filter by Subdomain" className="p-2 border rounded" />
          <input type="text" placeholder="Filter by IP" className="p-2 border rounded" />
        </div>
      </div>
    );
  }
  