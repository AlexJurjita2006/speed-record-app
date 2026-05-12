import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const submitRecord = async (req, res) => {
  try {
    const { routeId, timeSeconds } = req.body;
    const userId = req.user.id;

    // Obține ruta
    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) return res.status(404).json({ error: 'Rută negăsită' });

    const avgSpeedKmh = route.distanceKm / (timeSeconds / 3600);

    // Upsert record (actualizează dacă timpul e mai bun)
    const existing = await prisma.record.findUnique({
      where: { userId_routeId: { userId, routeId } }
    });

    let record;
    if (existing) {
      if (timeSeconds < existing.timeSeconds) {
        record = await prisma.record.update({
          where: { id: existing.id },
          data: { timeSeconds, avgSpeedKmh }
        });
      } else {
        return res.status(400).json({ error: 'Acest timp nu este mai bun decât recordul tău personal' });
      }
    } else {
      record = await prisma.record.create({
        data: { userId, routeId, timeSeconds, avgSpeedKmh }
      });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { routeId } = req.query;
    if (!routeId) return res.status(400).json({ error: 'routeId required' });

    const records = await prisma.record.findMany({
      where: { routeId: parseInt(routeId) },
      include: { user: { select: { username: true } } },
      orderBy: { timeSeconds: 'asc' },
      take: 20
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await prisma.record.findMany({
      where: { userId },
      include: { route: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};