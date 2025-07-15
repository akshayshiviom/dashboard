import { Notification, Customer, Partner, Renewal, Task, User } from '@/types';
import { mockTasks } from '@/utils/mockTasks';
import { useAuth } from '@/contexts/AuthContext';

export class NotificationService {
  static generateNotifications(
    tasks: Task[],
    renewals: Renewal[],
    customers: Customer[],
    partners: Partner[],
    userRole: string,
    userId: string
  ): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    // Task-related notifications
    notifications.push(...this.generateTaskNotifications(tasks, userRole, userId, now));
    
    // Renewal-related notifications
    notifications.push(...this.generateRenewalNotifications(renewals, customers, now));
    
    // Partner onboarding notifications
    notifications.push(...this.generatePartnerNotifications(partners, now));
    
    // Customer activity notifications
    notifications.push(...this.generateCustomerNotifications(customers, now));
    
    // System notifications
    notifications.push(...this.generateSystemNotifications(userRole, now));

    // Sort by priority and creation date
    return notifications.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  private static generateTaskNotifications(
    tasks: Task[],
    userRole: string,
    userId: string,
    now: Date
  ): Notification[] {
    const notifications: Notification[] = [];
    
    // Filter tasks based on user role and assignments
    const relevantTasks = tasks.filter(task => {
      if (userRole === 'admin') return true;
      return task.assignedTo === userId;
    });

    relevantTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Overdue tasks
      if (daysDiff < 0 && task.status !== 'completed') {
        notifications.push({
          id: `task-overdue-${task.id}`,
          type: 'task',
          priority: 'urgent',
          title: 'Overdue Task',
          message: `"${task.title}" is ${Math.abs(daysDiff)} day(s) overdue`,
          read: false,
          createdAt: now,
          relatedId: task.id,
          relatedType: 'task',
          actionUrl: `/?tab=tasks&taskId=${task.id}`,
          metadata: { taskId: task.id, daysOverdue: Math.abs(daysDiff) }
        });
      }
      
      // Tasks due today
      else if (daysDiff === 0 && task.status !== 'completed') {
        notifications.push({
          id: `task-due-today-${task.id}`,
          type: 'task',
          priority: 'high',
          title: 'Task Due Today',
          message: `"${task.title}" is due today`,
          read: false,
          createdAt: now,
          relatedId: task.id,
          relatedType: 'task',
          actionUrl: `/?tab=tasks&taskId=${task.id}`,
          metadata: { taskId: task.id }
        });
      }
      
      // Tasks due tomorrow
      else if (daysDiff === 1 && task.status !== 'completed') {
        notifications.push({
          id: `task-due-tomorrow-${task.id}`,
          type: 'task',
          priority: 'medium',
          title: 'Task Due Tomorrow',
          message: `"${task.title}" is due tomorrow`,
          read: false,
          createdAt: now,
          relatedId: task.id,
          relatedType: 'task',
          actionUrl: `/?tab=tasks&taskId=${task.id}`,
          metadata: { taskId: task.id }
        });
      }
    });

    return notifications;
  }

  private static generateRenewalNotifications(
    renewals: Renewal[],
    customers: Customer[],
    now: Date
  ): Notification[] {
    const notifications: Notification[] = [];

    renewals.forEach(renewal => {
      const customer = customers.find(c => c.id === renewal.customerId);
      const customerName = customer?.name || 'Unknown Customer';
      const renewalDate = new Date(renewal.renewalDate);
      const daysDiff = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Overdue renewals
      if (renewal.status === 'overdue') {
        notifications.push({
          id: `renewal-overdue-${renewal.id}`,
          type: 'renewal',
          priority: 'urgent',
          title: 'Overdue Renewal',
          message: `${customerName}'s renewal is ${Math.abs(daysDiff)} day(s) overdue`,
          read: false,
          createdAt: now,
          relatedId: renewal.id,
          relatedType: 'renewal',
          actionUrl: `/?tab=renewals&renewalId=${renewal.id}`,
          metadata: { renewalId: renewal.id, customerId: renewal.customerId }
        });
      }
      
      // Due renewals
      else if (renewal.status === 'due') {
        notifications.push({
          id: `renewal-due-${renewal.id}`,
          type: 'renewal',
          priority: 'high',
          title: 'Renewal Due',
          message: `${customerName}'s renewal is due soon`,
          read: false,
          createdAt: now,
          relatedId: renewal.id,
          relatedType: 'renewal',
          actionUrl: `/?tab=renewals&renewalId=${renewal.id}`,
          metadata: { renewalId: renewal.id, customerId: renewal.customerId }
        });
      }
      
      // Upcoming renewals (within 30 days)
      else if (renewal.status === 'upcoming' && daysDiff <= 30) {
        notifications.push({
          id: `renewal-upcoming-${renewal.id}`,
          type: 'renewal',
          priority: 'medium',
          title: 'Upcoming Renewal',
          message: `${customerName}'s renewal is in ${daysDiff} day(s)`,
          read: false,
          createdAt: now,
          relatedId: renewal.id,
          relatedType: 'renewal',
          actionUrl: `/?tab=renewals&renewalId=${renewal.id}`,
          metadata: { renewalId: renewal.id, customerId: renewal.customerId, daysUntil: daysDiff }
        });
      }
    });

    return notifications;
  }

  private static generatePartnerNotifications(partners: Partner[], now: Date): Notification[] {
    const notifications: Notification[] = [];

    partners.forEach(partner => {
      // Incomplete onboarding
      if (partner.onboarding && partner.onboarding.completionPercentage < 100) {
        const stuckStages = Object.values(partner.onboarding.stages).filter(
          stage => stage.status === 'in-progress' && 
          stage.startedAt && 
          (now.getTime() - new Date(stage.startedAt).getTime()) > (7 * 24 * 60 * 60 * 1000) // 7 days
        );

        if (stuckStages.length > 0) {
          notifications.push({
            id: `partner-onboarding-stuck-${partner.id}`,
            type: 'partner-onboarding',
            priority: 'high',
            title: 'Partner Onboarding Delayed',
            message: `${partner.name} has been stuck in onboarding for over a week`,
            read: false,
            createdAt: now,
            relatedId: partner.id,
            relatedType: 'partner',
            actionUrl: `/?tab=partner-onboarding&partnerId=${partner.id}`,
            metadata: { partnerId: partner.id, stuckStages: stuckStages.length }
          });
        }
      }

      // Unsigned agreements
      if (!partner.agreementSigned) {
        const daysSinceCreation = Math.ceil((now.getTime() - partner.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation > 14) {
          notifications.push({
            id: `partner-agreement-unsigned-${partner.id}`,
            type: 'partner-onboarding',
            priority: 'medium',
            title: 'Unsigned Agreement',
            message: `${partner.name} hasn't signed the agreement for ${daysSinceCreation} days`,
            read: false,
            createdAt: now,
            relatedId: partner.id,
            relatedType: 'partner',
            actionUrl: `/?tab=partners&partnerId=${partner.id}`,
            metadata: { partnerId: partner.id, daysSinceCreation }
          });
        }
      }
    });

    return notifications;
  }

  private static generateCustomerNotifications(customers: Customer[], now: Date): Notification[] {
    const notifications: Notification[] = [];

    customers.forEach(customer => {
      // Inactive customers with recent activity
      if (customer.status === 'inactive') {
        const daysSinceCreation = Math.ceil((now.getTime() - customer.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation <= 30) {
          notifications.push({
            id: `customer-recently-inactive-${customer.id}`,
            type: 'customer-activity',
            priority: 'medium',
            title: 'Recently Inactive Customer',
            message: `${customer.name} became inactive recently - follow up needed`,
            read: false,
            createdAt: now,
            relatedId: customer.id,
            relatedType: 'customer',
            actionUrl: `/?tab=customers&customerId=${customer.id}`,
            metadata: { customerId: customer.id, daysSinceCreation }
          });
        }
      }

      // High-value pending customers
      if (customer.status === 'pending' && customer.value && customer.value > 30000) {
        notifications.push({
          id: `customer-high-value-pending-${customer.id}`,
          type: 'customer-activity',
          priority: 'high',
          title: 'High-Value Customer Pending',
          message: `${customer.name} (₹${customer.value.toLocaleString()}) needs attention`,
          read: false,
          createdAt: now,
          relatedId: customer.id,
          relatedType: 'customer',
          actionUrl: `/?tab=customers&customerId=${customer.id}`,
          metadata: { customerId: customer.id, value: customer.value }
        });
      }
    });

    return notifications;
  }

  private static generateSystemNotifications(userRole: string, now: Date): Notification[] {
    const notifications: Notification[] = [];

    // Admin-only system notifications
    if (userRole === 'admin') {
      // Data sync notifications
      notifications.push({
        id: `system-data-sync-${now.getTime()}`,
        type: 'system',
        priority: 'low',
        title: 'System Update',
        message: 'Daily data synchronization completed successfully',
        read: false,
        createdAt: now,
        actionUrl: '/?tab=settings',
        metadata: { type: 'data-sync' }
      });
    }

    return notifications;
  }

  static markAsRead(notificationId: string, notifications: Notification[]): Notification[] {
    return notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
  }

  static markAllAsRead(notifications: Notification[]): Notification[] {
    return notifications.map(notification => ({ ...notification, read: true }));
  }

  static getUnreadCount(notifications: Notification[]): number {
    return notifications.filter(n => !n.read).length;
  }
}