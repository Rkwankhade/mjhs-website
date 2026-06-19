import { prisma } from './db';

interface AuditOptions {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}

export async function createAuditLog(opts: AuditOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: opts.adminId,
        action: opts.action,
        entity: opts.entity,
        entityId: opts.entityId,
        details: opts.details,
        ipAddress: opts.ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
