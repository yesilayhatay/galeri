const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  // CORS izinleri (Frontend'den istek atabilmek için)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json([]);
  }

  try {
    const searchExpression = `tags:${q}* OR public_id:*${q}* OR folder:*${q}* OR context.caption:*${q}*`;

    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    return res.status(200).json(result.resources);
  } catch (error) {
    console.error("Cloudinary Arama Hatası:", error);
    return res.status(500).json({ error: "Arama yapılırken bir hata oluştu." });
  }
}