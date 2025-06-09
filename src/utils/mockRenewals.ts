
import { Renewal } from '../types';

export const mockRenewals: Renewal[] = [
  {
    id: '1',
    customerId: '1',
    partnerId: '1',
    productId: '1',
    renewalDate: new Date('2024-07-15'),
    contractValue: 8999.99,
    status: 'upcoming',
    notificationSent: true,
    lastContactDate: new Date('2024-06-01'),
    notes: 'Customer interested in upgrading to premium plan'
  },
  {
    id: '2',
    customerId: '2',
    partnerId: '2',
    productId: '2',
    renewalDate: new Date('2024-06-20'),
    contractValue: 3999.99,
    status: 'due',
    notificationSent: true,
    lastContactDate: new Date('2024-06-10'),
    notes: 'Waiting for budget approval'
  },
  {
    id: '3',
    customerId: '3',
    partnerId: '1',
    productId: '5',
    renewalDate: new Date('2024-06-01'),
    contractValue: 11999.99,
    status: 'overdue',
    notificationSent: true,
    lastContactDate: new Date('2024-05-28'),
    notes: 'Multiple follow-ups sent, no response yet'
  },
  {
    id: '4',
    customerId: '4',
    partnerId: '3',
    productId: '3',
    renewalDate: new Date('2024-08-30'),
    contractValue: 4499.99,
    status: 'upcoming',
    notificationSent: false,
    notes: 'Early renewal opportunity identified'
  },
  {
    id: '5',
    customerId: '1',
    partnerId: '1',
    productId: '4',
    renewalDate: new Date('2024-05-15'),
    contractValue: 5399.99,
    status: 'renewed',
    notificationSent: true,
    lastContactDate: new Date('2024-05-10'),
    notes: 'Successfully renewed for 2 years'
  }
];
