import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Charts temporarily removed due to compatibility issues
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import { Report, Bill, Customer } from '@/types';
import { apiService } from '@/services/api';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [reportsData, billsData, customersData] = await Promise.all([
        apiService.getReports(),
        apiService.getBills(),
        apiService.getCustomers(),
      ]);
      setReports(reportsData);
      setBills(billsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Mock data for demo
      setReports({
        totalSales: 125000,
        totalBills: 248,
        pendingAmount: 15000,
        paidAmount: 110000,
        recentBills: [],
      });
      setBills([
        {
          id: '1',
          billNo: 'BILL001',
          customerId: '1',
          items: [],
          totalAmount: 157.94,
          finalAmount: 157.94,
          status: 'paid',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          billNo: 'BILL002',
          customerId: '2',
          items: [],
          totalAmount: 89.97,
          finalAmount: 89.97,
          status: 'pending',
          createdAt: '2024-01-20T14:30:00Z',
        },
        {
          id: '3',
          billNo: 'BILL003',
          customerId: '1',
          items: [],
          totalAmount: 234.50,
          finalAmount: 234.50,
          status: 'paid',
          createdAt: '2024-01-25T16:45:00Z',
        },
      ]);
      setCustomers([
        { id: '1', accountNo: 'ACC001', name: 'John Doe', phone: '+1234567890', address: '123 Main St' },
        { id: '2', accountNo: 'ACC002', name: 'Jane Smith', phone: '+1987654321', address: '456 Oak Ave' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Sales data for charts
  const salesData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 19000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 25000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 32000 },
  ];

  const statusData = [
    { name: 'Paid', value: reports?.paidAmount || 0, color: '#10b981' },
    { name: 'Pending', value: reports?.pendingAmount || 0, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Total Sales',
      value: reports ? `$${reports.totalSales.toLocaleString()}` : '$0',
      icon: DollarSign,
      description: 'All time revenue',
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Total Bills',
      value: reports?.totalBills || 0,
      icon: FileText,
      description: 'Generated invoices',
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
      title: 'Active Customers',
      value: customers.length,
      icon: Users,
      description: 'Registered customers',
      color: 'text-primary bg-primary/10',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights for your billing system</p>
      </div>

      {/* Summary Stats */}
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills Report</TabsTrigger>
          <TabsTrigger value="customers">Customer Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Revenue overview for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-lg font-bold text-primary">${data.sales.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Distribution of paid vs pending amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusData.map((data) => (
                    <div key={data.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: data.color }}
                        ></div>
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <span className="text-lg font-bold">${data.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <Card>
            <CardHeader>
              <CardTitle>Bills Summary</CardTitle>
              <CardDescription>Complete list of all generated bills</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill No</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => {
                    const customer = customers.find(c => c.id === bill.customerId);
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNo}</TableCell>
                        <TableCell>{customer?.name || 'Unknown'}</TableCell>
                        <TableCell>${bill.finalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Summary</CardTitle>
              <CardDescription>Overview of all registered customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total Bills</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => {
                    const customerBills = bills.filter(bill => bill.customerId === customer.id);
                    const totalAmount = customerBills.reduce((sum, bill) => sum + bill.finalAmount, 0);
                    
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.accountNo}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customerBills.length}</TableCell>
                        <TableCell>${totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;