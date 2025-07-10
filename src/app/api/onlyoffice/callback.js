// pages/api/onlyoffice/callback.js (with Next.js)

export default async (req, res) => {
  // OnlyOffice posts a webhook with document info
  console.log("Received callback from OnlyOffice");

  // Validate and process:
  // - Store the updated document
  // - Handle versioning
  // - Handle collaboration signals

  res.status(200).json({ error: 0 }); // <- OnlyOffice expects a 200 with {"error": 0}
};
