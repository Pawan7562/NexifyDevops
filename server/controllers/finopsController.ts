import { Request, Response } from 'express';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../security/auth';

export function getInvoices(req: Request, res: Response) {
  const invoices = db.getInvoices();
  return res.status(200).json({ success: true, count: invoices.length, data: invoices });
}

export function createInvoice(req: AuthenticatedRequest, res: Response) {
  const { projectId, clientName, amountINR, dueDate, billingCycle, lineItems } = req.body;

  if (!projectId || !clientName || !amountINR) {
    return res.status(400).json({ success: false, error: 'projectId, clientName, and amountINR are required.' });
  }

  const invoiceNumber = `NXF-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const invoice = db.addInvoice({
    projectId,
    invoiceNumber,
    clientName,
    amountINR: Number(amountINR),
    status: 'PENDING',
    dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    billingCycle: billingCycle || 'Current Month',
    lineItems: lineItems || [{ description: 'DevOps & SLA Fleet Maintenance', amount: Number(amountINR) }],
  });

  db.logAudit({
    actor: req.user?.email || 'System',
    action: 'INVOICE_GENERATED',
    target: `${invoice.invoiceNumber} (${clientName} - ₹${amountINR})`,
    severity: 'INFO',
  });

  return res.status(201).json({ success: true, data: invoice });
}
