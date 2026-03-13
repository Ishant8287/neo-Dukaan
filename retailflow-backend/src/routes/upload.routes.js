import express from "express";
import ImageKit from "imagekit";

const router = express.Router();

router.get("/auth", (req, res) => {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  const result = imagekit.getAuthenticationParameters();
  res.status(200).json(result);
});

export default router;
