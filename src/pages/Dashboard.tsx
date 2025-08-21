import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Report } from '@/types';
import { apiService } from '@/services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiService.getReports();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        // Mock data for demo purposes
        setReports({
          totalSales: 125000,
          totalBills: 248,
          pendingAmount: 15000,
          paidAmount: 110000,
          recentBills: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const stats = [
    {
      title: 'Total Sales',
      value: reports ? `$${reports.totalSales.toLocaleString()}` : '$0',
      icon: DollarSign,
      description: 'This month',
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Total Bills',
      value: reports?.totalBills || 0,
      icon: FileText,
      description: 'All time',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pending Amount',
      value: reports ? `$${reports.pendingAmount.toLocaleString()}` : '$0',
      icon: TrendingUp,
      description: 'Awaiting payment',
      color: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Paid Amount',
      value: reports ? `$${reports.paidAmount.toLocaleString()}` : '$0',
      icon: Calendar,
      description: 'This month',
      color: 'text-primary bg-primary/10',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Bill',
      description: 'Generate a new invoice for a customer',
      action: () => navigate('/billing'),
      icon: FileText,
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      action: () => navigate('/customers'),
      icon: Users,
    },
    {
      title: 'Add Item',
      description: 'Add a new product or service',
      action: () => navigate('/items'),
      icon: Package,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your billing system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Card key={action.title} className="cursor-pointer hover:bg-accent transition-colors" onClick={action.action}>
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;