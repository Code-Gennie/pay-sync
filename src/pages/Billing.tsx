import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, FileText, Eye, Calendar } from 'lucide-react';
import { Customer, Item, Bill, BillItem } from '@/types';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Billing: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  
  // New bill form
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [newItem, setNewItem] = useState({
    itemId: '',
    quantity: '',
    rate: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersData, itemsData, billsData] = await Promise.all([
        apiService.getCustomers(),
        apiService.getItems(),
        apiService.getBills(),
      ]);
      setCustomers(customersData);
      setItems(itemsData);
      setBills(billsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Mock data for demo
      setCustomers([
        { id: '1', accountNo: 'ACC001', name: 'John Doe', phone: '+1234567890', address: '123 Main St' },
        { id: '2', accountNo: 'ACC002', name: 'Jane Smith', phone: '+1987654321', address: '456 Oak Ave' },
      ]);
      setItems([
        { id: '1', itemId: 'ITEM001', name: 'Book', price: 25.99 },
        { id: '2', itemId: 'ITEM002', name: 'Notebook', price: 5.99 },
      ]);
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addItemToBill = () => {
    const errors: Record<string, string> = {};
    
    if (!newItem.itemId) {
      errors.itemId = 'Please select an item';
    }
    if (!newItem.quantity || parseInt(newItem.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    if (!newItem.rate || parseFloat(newItem.rate) <= 0) {
      errors.rate = 'Rate must be greater than 0';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const selectedItem = items.find(item => item.id === newItem.itemId);
    if (!selectedItem) return;

    const quantity = parseInt(newItem.quantity);
    const rate = parseFloat(newItem.rate);
    const amount = quantity * rate;

    const billItem: BillItem = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      item: selectedItem,
      quantity,
      rate,
      amount,
    };

    setBillItems([...billItems, billItem]);
    setNewItem({ itemId: '', quantity: '', rate: '' });
    setFormErrors({});
  };

  const removeItemFromBill = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleCreateBill = async () => {
    if (!selectedCustomer) {
      toast({ title: 'Error', description: 'Please select a customer', variant: 'destructive' });
      return;
    }
    if (billItems.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one item', variant: 'destructive' });
      return;
    }

    try {
      const totalAmount = calculateTotal();
      const newBill = {
        billNo: `BILL${Date.now()}`,
        customerId: selectedCustomer,
        items: billItems,
        totalAmount,
        finalAmount: totalAmount,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
      };

      await apiService.createBill(newBill);
      toast({ title: 'Bill created successfully!' });
      
      // Reset form
      setSelectedCustomer('');
      setBillItems([]);
      setActiveTab('view');
      fetchData();
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Failed to create bill',
        variant: 'destructive'
      });
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
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Create and manage customer bills</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Bill</TabsTrigger>
          <TabsTrigger value="view">View Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Bill</CardTitle>
              <CardDescription>Generate a new invoice for your customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Selection */}
              <div className="grid gap-2">
                <Label>Select Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.accountNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add Items */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Add Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select value={newItem.itemId} onValueChange={(value) => {
                      const selectedItem = items.find(item => item.id === value);
                      setNewItem({ 
                        ...newItem, 
                        itemId: value,
                        rate: selectedItem?.price.toString() || ''
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - ${item.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.itemId && (
                      <Alert variant="destructive">
                        <AlertDescription>{formErrors.itemId}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="1"
                    />
                    {formErrors.quantity && (
                      <Alert variant="destructive">
                        <AlertDescription>{formErrors.quantity}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.rate}
                      onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                      placeholder="0.00"
                    />
                    {formErrors.rate && (
                      <Alert variant="destructive">
                        <AlertDescription>{formErrors.rate}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addItemToBill} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bill Items Table */}
              {billItems.length > 0 && (
                <div>
                  <h3 className="font-medium mb-4">Bill Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.item?.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.rate.toFixed(2)}</TableCell>
                          <TableCell>${item.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeItemFromBill(item.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                        <TableCell className="font-bold">${calculateTotal().toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleCreateBill} disabled={!selectedCustomer || billItems.length === 0}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>All Bills</CardTitle>
              <CardDescription>View and manage customer bills</CardDescription>
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
                    <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
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

export default Billing;