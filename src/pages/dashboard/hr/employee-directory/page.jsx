import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddEmployeeModal from '@/components/dashboard/hr/employee-directory/add-employee';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, Layers3Icon } from 'lucide-react';
import AccountingTable from '@/components/dashboard/accounting/table';
import MetricCard from '@/components/dashboard/hr/metric-card';
import EmployeeService from '@/api/employee';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import youtubeIcon from '@/assets/icons/youtube-red.png';

const tableColumns = [
  { key: 'name', label: 'Employee Name' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'status', label: 'Status' },
];

const employeeStatusStyles = {
  Active: 'bg-green-100 text-green-800 hover:bg-green-100',
  Inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  'On Leave': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Terminated: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const employeeDropdownActions = [
  { key: 'view', label: 'View Profile' },
  { key: 'edit', label: 'Edit Details' },
  { key: 'assign-asset', label: 'Assign Asset' },
  { key: 'view-attendance', label: 'View Attendance' },
];

export default function EmployeeDirectory() {
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { activeBusiness } = useUserStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    exitedEmployees: 0,
  });
  const navigate = useNavigate();

  // Transform employee data to match table format
  const transformEmployeeData = (employeesData) => {
    return employeesData.map((employee) => {
      return {
        id: employee.id || employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.positionTitle || employee.position || '-',
        department: employee.departmentName || employee.department || '-',
        employeeId: employee.employeeId || '-',
        status:
          employee.status === 'ACTIVE'
            ? 'Active'
            : employee.status === 'ON_LEAVE'
              ? 'On Leave'
              : employee.status === 'TERMINATED'
                ? 'Terminated'
                : 'Inactive',
      };
    });
  };

  const employeeData = transformEmployeeData(employees);

  // Sample chart data for metrics
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
  ];

  // Create metrics from analytics data
  const employeeMetrics = [
    {
      title: 'Total Employees',
      value: analytics.totalEmployees,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
      emptyState: true,
    },
    {
      title: 'Active Employees',
      value: analytics.activeEmployees,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
      emptyState: true,
    },
    {
      title: 'On Leave',
      value: analytics.onLeave,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
      emptyState: true,
    },
    {
      title: 'Exited Employees',
      value: analytics.exitedEmployees,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
      emptyState: true,
    },
  ];

  const handleEmployeeTableAction = (action, employee) => {
    console.log('Employee action:', action, employee);

    switch (action) {
      case 'view':
        navigate(`/dashboard/hr/employee-directory/employees/${employee.id}`);
        break;
      case 'edit':
        // TODO: Open edit modal
        console.log('Edit employee:', employee.id);
        break;
      case 'assign-asset':
        // TODO: Navigate to asset assignment
        console.log('Assign asset to:', employee.id);
        break;
      case 'view-attendance':
        // TODO: Navigate to attendance view
        navigate(`/dashboard/hr/attendance-leave?employeeId=${employee.id}`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAllItems = (checked) => {
    if (checked) {
      setSelectedItems(employeeData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedItems([]); // Clear selections when changing pages
  };

  useEffect(() => {
    if (activeBusiness) {
      // Fetch employee data based on businessId
      const fetchEmployeeData = async () => {
        try {
          setIsLoading(true);
          const response = await EmployeeService.fetch({
            page: currentPage,
            perPage: paginationData.pageSize,
          });

          // Extract employee data from response
          const responseData = response.data?.data || {};
          const employeesData = responseData.employees || [];

          setEmployees(employeesData);

          // Update pagination data from API response
          setPaginationData({
            page: responseData.page || 1,
            totalPages: responseData.totalPages || 1,
            pageSize: responseData.limit || 20,
            totalCount: responseData.totalDocs || employeesData.length,
          });

          // Fetch analytics data
          const analyticsRes = await EmployeeService.analytics();
          console.log('Employee analytics data:', analyticsRes.data);
          setAnalytics(
            analyticsRes.data?.data || {
              totalEmployees: 0,
              activeEmployees: 0,
              onLeave: 0,
              exitedEmployees: 0,
            }
          );
        } catch (error) {
          console.error('Error fetching employee data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEmployeeData();
    }
  }, [
    activeBusiness,
    isCreateEmployeeOpen,
    currentPage,
    paginationData.pageSize,
  ]);

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Employee Directory</h1>
          <p className="text-sm text-[#7D7D7D]">
            View and manage all employees records in one centralized directory
          </p>
        </hgroup>

        <div className="flex items-center gap-4">
          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <Button
            onClick={() => setIsCreateEmployeeOpen(true)}
            className="h-10 gap-2 rounded-lg bg-[#6C2BD9] px-5 text-sm font-medium text-white hover:bg-[#5A23B8]"
          >
            <PlusCircleIcon className="size-4" />
            Add New Employee
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {employeeMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              percentage={metric.percentage}
              isPositive={metric.isPositive}
              chartData={metric.chartData}
              emptyState={metric.emptyState}
            />
          ))}
        </div>

        <div className="mt-10">
          <AccountingTable
            title={'All Employees'}
            data={employeeData}
            columns={tableColumns}
            searchFields={['name', 'employeeId', 'role', 'department']}
            searchPlaceholder="Search employee......."
            statusStyles={employeeStatusStyles}
            dropdownActions={employeeDropdownActions}
            paginationData={paginationData}
            onPageChange={handlePageChange}
            onRowAction={handleEmployeeTableAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
            isLoading={isLoading}
            customHeaderActions={
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[180px] gap-2">
                  <Layers3Icon className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="All Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Department</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </div>
      </div>

      <AddEmployeeModal
        open={isCreateEmployeeOpen}
        onOpenChange={setIsCreateEmployeeOpen}
      />
    </div>
  );
}
