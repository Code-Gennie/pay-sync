import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, Package, FileText, BarChart3, Settings, HelpCircle, Info } from 'lucide-react';

const Help: React.FC = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: Info,
      items: [
        {
          question: 'How do I navigate the system?',
          answer: 'Use the sidebar navigation to access different modules: Dashboard for overview, Customers for managing clients, Items for products/services, Billing for creating invoices, and Reports for analytics.',
        },
        {
          question: 'What should I do first?',
          answer: 'Start by adding your customers in the Customers section, then add your products/services in the Items section. After that, you can create bills in the Billing module.',
        },
      ],
    },
    {
      title: 'Customer Management',
      icon: Users,
      items: [
        {
          question: 'How do I add a new customer?',
          answer: 'Go to the Customers page, click "Add Customer", fill in the required information (Account Number, Name, Phone, and Address), and click "Create". Name and Phone are required fields.',
        },
        {
          question: 'Can I edit customer information?',
          answer: 'Yes, click the pencil icon next to any customer in the table to edit their information. You can update any field except the customer ID.',
        },
        {
          question: 'How do I delete a customer?',
          answer: 'Click the trash icon next to the customer you want to delete. You\'ll be asked to confirm before the deletion is completed.',
        },
      ],
    },
    {
      title: 'Item Management',
      icon: Package,
      items: [
        {
          question: 'How do I add products or services?',
          answer: 'Navigate to the Items page, click "Add Item", enter the Item ID, Name, Price, and optional Description. Name and Price are required, and price must be a positive number.',
        },
        {
          question: 'Can I update item prices?',
          answer: 'Yes, use the edit function to update item prices. The new price will apply to all future bills, but existing bills will retain their original pricing.',
        },
        {
          question: 'What\'s the difference between Item ID and Name?',
          answer: 'Item ID is a unique identifier (like ITEM001) for internal tracking, while Name is the display name shown to customers on bills.',
        },
      ],
    },
    {
      title: 'Billing Process',
      icon: FileText,
      items: [
        {
          question: 'How do I create a new bill?',
          answer: 'Go to Billing → Create Bill, select a customer, add items by choosing from your catalog, specify quantity and rate, then click "Create Bill". The system automatically calculates totals.',
        },
        {
          question: 'Can I modify the rate for items on a bill?',
          answer: 'Yes, you can adjust the rate for each item when creating a bill. This allows for custom pricing or discounts without changing your master item catalog.',
        },
        {
          question: 'How do I view existing bills?',
          answer: 'Use the "View Bills" tab in the Billing section to see all generated bills, their status, amounts, and customer information.',
        },
        {
          question: 'What do the bill statuses mean?',
          answer: 'Draft: Bill created but not finalized, Sent: Bill sent to customer, Paid: Payment received, Overdue: Payment past due date.',
        },
      ],
    },
    {
      title: 'Reports and Analytics',
      icon: BarChart3,
      items: [
        {
          question: 'What reports are available?',
          answer: 'The Reports section provides overview analytics, bills summary, and customer reports with charts showing sales trends and payment status distribution.',
        },
        {
          question: 'How do I track pending payments?',
          answer: 'The Dashboard shows pending amounts in the summary cards, and the Reports section provides detailed breakdowns of paid vs pending amounts.',
        },
        {
          question: 'Can I see customer-specific analytics?',
          answer: 'Yes, the Customer Report tab shows each customer\'s total bills and amounts, helping you identify your best customers.',
        },
      ],
    },
  ];

  const quickTips = [
    'Use the search functionality in Customers and Items to quickly find what you need',
    'The Dashboard provides a quick overview - check it regularly for key metrics',
    'Bill numbers are automatically generated with timestamps for easy tracking',
    'All forms include validation to prevent errors - required fields are clearly marked',
    'Use the sidebar collapse button to maximize your workspace when needed',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-muted-foreground">Learn how to use the BillSync Pro billing system effectively</p>
      </div>

      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          Need additional support? This help section covers the most common questions and procedures. 
          For technical issues, please contact your system administrator.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
                <CardDescription>
                  Common questions about {section.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Helpful hints for better efficiency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
              <CardDescription>Technical specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">Browser Support</h4>
                <p className="text-sm text-muted-foreground">Chrome, Firefox, Safari, Edge (latest versions)</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Internet Connection</h4>
                <p className="text-sm text-muted-foreground">Required for API connectivity</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Screen Resolution</h4>
                <p className="text-sm text-muted-foreground">Optimized for 1024px and above</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Notes</CardTitle>
              <CardDescription>Important security information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Always log out when finished
              </p>
              <p className="text-sm text-muted-foreground">
                • Keep your login credentials secure
              </p>
              <p className="text-sm text-muted-foreground">
                • Report any suspicious activity
              </p>
              <p className="text-sm text-muted-foreground">
                • Session expires after inactivity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;