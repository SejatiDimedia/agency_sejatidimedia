import { prisma } from './prisma';

interface AuditLogParams {
  action: string;
  entityId: string;
  entityName: string;
  projectName?: string | null;
  oldValue?: string | null;
  newValue: string;
  userId?: string | null;
  userName?: string | null;
}

export async function logAction({
  action,
  entityId,
  entityName,
  projectName,
  oldValue,
  newValue,
  userId,
  userName,
}: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityId,
        entityName,
        projectName: projectName || null,
        oldValue: oldValue || null,
        newValue,
        userId: userId || null,
        userName: userName || 'System',
      },
    });
  } catch (err) {
    console.error('[Audit Log Error]', err);
  }
}
