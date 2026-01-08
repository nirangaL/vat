import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { EmailService } from './email.service';
import { NotificationsGateway } from './websocket.gateway';
import { NotificationType } from '@shared/constants';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private emailService: EmailService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.IN_APP,
    companyId?: string,
    metadata?: Record<string, any>,
  ) {
    const notification = await this.notificationModel.create({
      userId,
      companyId,
      type,
      title,
      message,
      isRead: false,
      metadata,
    });

    if (type === NotificationType.IN_APP) {
      this.notificationsGateway.sendToUser(userId, 'notification', {
        id: notification._id,
        title,
        message,
        createdAt: notification.createdAt,
        metadata,
      });
    }

    return notification;
  }

  async sendEmailNotification(
    userId: string,
    email: string,
    title: string,
    message: string,
    companyId?: string,
  ) {
    await this.emailService.sendNotificationEmail(email, title, message);

    return this.create(
      userId,
      title,
      message,
      NotificationType.EMAIL,
      companyId,
    );
  }

  async sendInAppNotification(
    userId: string,
    title: string,
    message: string,
    companyId?: string,
    metadata?: Record<string, any>,
  ) {
    return this.create(
      userId,
      title,
      message,
      NotificationType.IN_APP,
      companyId,
      metadata,
    );
  }

  async findByUser(userId: string, query: any = {}) {
    const { page = 1, limit = 20, isRead } = query;
    const filter: any = { userId };

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.notificationModel.countDocuments(filter),
    ]);

    return {
      items: notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      unreadCount: await this.notificationModel.countDocuments({
        userId,
        isRead: false,
      }),
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true },
    );

    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(id: string, userId: string) {
    await this.notificationModel.findOneAndDelete({ _id: id, userId });
    return { message: 'Notification deleted successfully' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
    });

    return { unreadCount: count };
  }
}
