export default function DetailsTable({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Detailed Data Table</h3>

      {/* Scrollable Table Body with Fixed Header */}
      <div className="relative overflow-y-auto max-h-[400px] rounded-lg">
        <table className="w-full table-auto border-collapse">
          {/* Sticky Header */}
          <thead className="bg-gray-200 sticky top-0 z-10 shadow">
            <tr>
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">Value</th>
            </tr>
          </thead>

          {/* Scrollable Body */}
          <tbody className="divide-y divide-gray-200">
            {data.emails?.map((email, idx) => (
              <tr key={`email-${idx}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2">Email</td>
                <td className="border px-4 py-2">{email}</td>
              </tr>
            ))}
            {data.hosts?.map((host, idx) => (
              <tr key={`host-${idx}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2">Subdomain</td>
                <td className="border px-4 py-2">{host}</td>
              </tr>
            ))}
            {data.ips?.map((ip, idx) => (
              <tr key={`ip-${idx}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2">IP</td>
                <td className="border px-4 py-2">{ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
