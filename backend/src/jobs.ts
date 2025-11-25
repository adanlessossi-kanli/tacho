import db from './database';

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  generatedAt: string;
  data: Record<string, any>;
}

const reports: Report[] = [];

export function generateDailyReport(): Report {
  const report: Report = {
    id: `report-${Date.now()}`,
    type: 'daily',
    generatedAt: new Date().toISOString(),
    data: {},
  };

  db.all('SELECT COUNT(*) as count FROM trips WHERE DATE(startTime) = DATE("now")', (err: any, rows: any) => {
    if (!err && rows) {
      report.data.tripsToday = rows[0]?.count || 0;
    }
  });

  db.all('SELECT SUM(distance) as total FROM trips WHERE DATE(startTime) = DATE("now")', (err: any, rows: any) => {
    if (!err && rows) {
      report.data.distanceToday = rows[0]?.total || 0;
    }
  });

  db.all('SELECT COUNT(DISTINCT vehicleId) as count FROM trips WHERE DATE(startTime) = DATE("now")', (err: any, rows: any) => {
    if (!err && rows) {
      report.data.vehiclesUsedToday = rows[0]?.count || 0;
    }
  });

  reports.push(report);
  console.log(`[JOB] Generated daily report: ${report.id}`);
  return report;
}

export function generateWeeklyReport(): Report {
  const report: Report = {
    id: `report-${Date.now()}`,
    type: 'weekly',
    generatedAt: new Date().toISOString(),
    data: {},
  };

  db.all(
    'SELECT COUNT(*) as count FROM trips WHERE startTime >= datetime("now", "-7 days")',
    (err: any, rows: any) => {
      if (!err && rows) {
        report.data.tripsWeek = rows[0]?.count || 0;
      }
    }
  );

  db.all(
    'SELECT SUM(distance) as total FROM trips WHERE startTime >= datetime("now", "-7 days")',
    (err: any, rows: any) => {
      if (!err && rows) {
        report.data.distanceWeek = rows[0]?.total || 0;
      }
    }
  );

  reports.push(report);
  console.log(`[JOB] Generated weekly report: ${report.id}`);
  return report;
}

export function generateAnalytics(): Record<string, any> {
  const analytics: Record<string, any> = {};

  db.all('SELECT COUNT(*) as count FROM vehicles', (err: any, rows: any) => {
    if (!err && rows) {
      analytics.totalVehicles = rows[0]?.count || 0;
    }
  });

  db.all('SELECT COUNT(*) as count FROM drivers', (err: any, rows: any) => {
    if (!err && rows) {
      analytics.totalDrivers = rows[0]?.count || 0;
    }
  });

  db.all('SELECT COUNT(*) as count FROM trips WHERE status = "completed"', (err: any, rows: any) => {
    if (!err && rows) {
      analytics.completedTrips = rows[0]?.count || 0;
    }
  });

  db.all('SELECT AVG(distance) as avg FROM trips WHERE status = "completed"', (err: any, rows: any) => {
    if (!err && rows) {
      analytics.avgDistance = rows[0]?.avg || 0;
    }
  });

  console.log('[JOB] Generated analytics');
  return analytics;
}

export function scheduleJobs(): void {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      generateDailyReport();
    }
  }, 60000);

  setInterval(() => {
    const now = new Date();
    if (now.getDay() === 1 && now.getHours() === 0 && now.getMinutes() === 0) {
      generateWeeklyReport();
    }
  }, 60000);

  setInterval(() => {
    generateAnalytics();
  }, 3600000);

  console.log('[JOB] Background jobs scheduled');
}

export function getReports(): Report[] {
  return reports;
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}
