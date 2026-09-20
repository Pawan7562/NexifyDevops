import { Request, Response } from 'express';
import { db } from '../db/database';
import { generateToken, verifyPassword, AuthenticatedRequest } from '../security/auth';

export async function handleLogin(req: Request, res: Response) {
  try {
    const { developerEmail, accessKey, securityPin } = req.body;

    if (!developerEmail || !accessKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required credentials: developerEmail and accessKey are required.',
      });
    }

    const user = db.findUserByEmail(developerEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid developer identity or access key. Please verify credentials.',
      });
    }

    // Verify Master Access Key
    const isKeyValid = await verifyPassword(accessKey, user.passwordHash);
    if (!isKeyValid) {
      db.logAudit({
        actor: developerEmail,
        action: 'FAILED_AUTH_ATTEMPT',
        target: 'Control Plane Login',
        severity: 'WARNING',
        ipAddress: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid developer identity or access key. Please verify credentials.',
      });
    }

    // Verify 2FA PIN if provided
    if (securityPin) {
      const isPinValid = await verifyPassword(securityPin, user.pinHash);
      if (!isPinValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid 2FA Security PIN. Check internal team security vault.',
        });
      }
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    db.updateUserLastLogin(user.id);
    db.logAudit({
      actor: user.email,
      action: 'USER_LOGIN',
      target: 'Nexify DevOps Control Plane',
      severity: 'INFO',
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication error.',
    });
  }
}

export function handleGetMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    },
  });
}
