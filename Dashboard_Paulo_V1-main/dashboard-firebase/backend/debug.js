// ROTA TEMPORÁRIA: src/routes/debug.ts
import express from "express";
const router = express.Router();

router.post("/debug-filtros", (req, res) => {
  console.log("[DEBUG] body recebido:", req.body);
  res.json({ ok: true, recebido: req.body });
});

export default router;
