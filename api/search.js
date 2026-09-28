const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  // CORS İzinleri
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(200).json([]);
  }

  try {
    const query = q.trim();

    // Cloudinary kuralına uygun arama ifadesi (Yıldız sadece sonda kullanılabilir)
    const searchExpression = `tags:${query}* OR filename:${query}* OR folder:${query}*`;

    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    return res.status(200).json(result.resources);
  } catch (error) {
    console.error("Cloudinary Arama Hatası:", error);
    // Hatanın detayını görebilmemiz için error mesajını da döndürelim
    return res.status(500).json({ 
      error: "Arama yapılırken bir hata oluştu.",
      details: error.message || error 
    });
  }
}
