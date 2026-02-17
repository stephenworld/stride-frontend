import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import EmployeeService from '@/api/employee';
import { useUserStore } from '@/stores/user-store';

const employeeFormSchema = z.object({
  employee: z.object({
    title: z.string().optional(),
    firstName: z.string().min(1, { message: 'First name is required' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.email({ message: 'Please enter a valid email address' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    employeeId: z.string().min(1, { message: 'Employee ID is required' }),
    department: z.string().min(1, { message: 'Department is required' }),
    position: z.string().min(1, { message: 'Position is required' }),
    dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
    hireDate: z.date({ required_error: 'Hire date is required' }),
    employmentType: z
      .string()
      .min(1, { message: 'Employment type is required' }),
    status: z.string().default('ACTIVE'),
  }),
  address: z.object({
    address1: z.string().min(1, { message: 'Address is required' }),
    address2: z.string().optional(),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    zipcode: z.string().min(1, { message: 'ZIP code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
  }),
});

export default function AddEmployeeModal({ open, onOpenChange, onSuccess }) {
  const { activeBusiness } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const form = useForm({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employee: {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        employeeId: '',
        department: '',
        position: '',
        dateOfBirth: undefined,
        hireDate: undefined,
        employmentType: '',
        status: 'ACTIVE',
      },
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const businessId = activeBusiness?._id;
      const dataWithAccountId = {
        ...data,
        businessId: businessId,
        accountId: activeBusiness?.accountId,
      };

      await EmployeeService.create({
        data: dataWithAccountId,
      });

      toast.success('Employee successfully added!');
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      form.reset();
    } catch (err) {
      console.log('Error submitting employee data:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to add employee. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  // Fetch departments and positions when modal opens
  useEffect(() => {
    async function fetchData() {
      if (!open) return;
      try {
        const [deptRes, posRes] = await Promise.all([
          EmployeeService.getDepartments(),
          EmployeeService.getPositions(),
        ]);
        setDepartments(deptRes.data?.data || []);
        setPositions(posRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching departments/positions:', error);
      }
    }
    fetchData();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader className={'w-full'}>
          <DialogTitle className="text-2xl font-semibold">
            Add Employee
          </DialogTitle>
          <p className="text-sm text-gray-600">Enter employee details</p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-4xl space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-6">
              {/* Title and Name Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
                <FormField
                  control={form.control}
                  name="employee.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'min-w-[55px]'}>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.firstName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.middleName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Middle name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter middle name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.lastName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employee.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employee ID and Department */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employee.employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter employee ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'h-10'}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.length > 0 ? (
                            departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="engineering">
                                Engineering
                              </SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="hr">
                                Human Resources
                              </SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Position and Employment Type */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employee.position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'h-10'}>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.length > 0 ? (
                            positions.map((pos) => (
                              <SelectItem key={pos.id} value={pos.id}>
                                {pos.title}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="senior">Senior</SelectItem>
                              <SelectItem value="mid">Mid-Level</SelectItem>
                              <SelectItem value="junior">Junior</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'h-10'}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                          <SelectItem value="PART_TIME">Part-Time</SelectItem>
                          <SelectItem value="CONTRACT">Contract</SelectItem>
                          <SelectItem value="INTERN">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date of Birth and Hire Date */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employee.dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'h-10 w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee.hireDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Hire Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'h-10 w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Address</h3>
                <p className="text-sm text-gray-600">Enter employee address</p>
              </div>

              {/* Street Addresses */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street address 1</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street address 2</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter city"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter state"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ZIP Code and Country */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP code</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter zipcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter country"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 w-full max-w-[35%]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 w-full max-w-[35%]"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
