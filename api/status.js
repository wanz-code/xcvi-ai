// api/status.js
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  // simple health response
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ status: 'ok' });
};