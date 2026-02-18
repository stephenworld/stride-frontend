import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  BuildingIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SaveIcon,
  PencilIcon,
  LandmarkIcon,
  CreditCardIcon,
  BanknoteIcon,
  FileTextIcon,
  WalletIcon,
  UploadCloudIcon,
  EyeIcon,
  Trash2Icon,
  DownloadIcon,
  ArrowUpRightIcon,
  InboxIcon,
  ClockIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import EmployeeService from '@/api/employee';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'documents', label: 'Documents' },
];

const STATUS_STYLES = {
  Active: 'bg-green-50 text-green-700 border border-green-200',
  Inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
  'On Leave': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Terminated: 'bg-red-50 text-red-700 border border-red-200',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="flex items-center gap-2 text-sm text-gray-800">
        {Icon && <Icon className="size-4 shrink-0 text-gray-400" />}
        <span>{value || '-'}</span>
      </div>
    </div>
  );
}

// ─── Salary Breakdown Modal ───────────────────────────────────────────────────
function SalaryBreakdownModal({ open, onOpenChange }) {
  const earnings = [
    { component: 'Basic Salary', taxable: 'Yes 15%', monthly: '₦145,000', annual: '₦145,000' },
    { component: 'Housing Allowance', taxable: 'Yes 15%', monthly: '₦145,000', annual: '₦145,000' },
    { component: 'Transport Allowance', taxable: 'Yes 15%', monthly: '₦145,000', annual: '₦145,000' },
    { component: 'Utility Allowance', taxable: 'Yes 15%', monthly: '₦145,000', annual: '₦145,000' },
  ];
  const deductions = [
    { component: 'Employer Pension (10%)', taxable: 'No', monthly: '₦145,000', annual: '₦145,000' },
    { component: 'PAYE Tax', taxable: 'No', monthly: '₦145,000', annual: '₦145,000' },
    { component: 'NHF Contribution', taxable: 'No', monthly: '₦145,000', annual: '₦145,000' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8"
        overlayClassName="bg-[#0C0C0CE5]"
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#254C00]">
            <BanknoteIcon className="size-5 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">Salary Breakdown</DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <h4 className="text-sm font-semibold text-gray-800">Salary Components</h4>

          {/* Earnings */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Earnings</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Components</th>
                  <th className="pb-2 font-normal">Taxable</th>
                  <th className="pb-2 font-normal">Monthly (₦)</th>
                  <th className="pb-2 font-normal">Annual (₦)</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((row, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-1.5 font-semibold text-gray-800">{row.component}</td>
                    <td className="py-1.5 text-gray-600">{row.taxable}</td>
                    <td className="py-1.5 font-semibold text-gray-800">{row.monthly}</td>
                    <td className="py-1.5 font-semibold text-gray-800">{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Deductions</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Components</th>
                  <th className="pb-2 font-normal">Taxable</th>
                  <th className="pb-2 font-normal">Monthly (₦)</th>
                  <th className="pb-2 font-normal">Annual (₦)</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((row, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-1.5 font-semibold text-gray-800">{row.component}</td>
                    <td className="py-1.5 text-gray-600">{row.taxable}</td>
                    <td className="py-1.5 font-semibold text-gray-800">{row.monthly}</td>
                    <td className="py-1.5 font-semibold text-gray-800">{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compensation Summary */}
          <div>
            <p className="mb-2 text-xs font-semibold text-[#6C2BD9]">Compensation Summary</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-normal">Duration</th>
                  <th className="pb-2 font-normal">Gross Pay (₦)</th>
                  <th className="pb-2 font-normal">Deductions (₦)</th>
                  <th className="pb-2 font-normal">Net Pay (₦)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-50">
                  <td className="py-1.5 font-semibold text-gray-800">Monthly</td>
                  <td className="py-1.5 font-semibold text-gray-800">₦200,000</td>
                  <td className="py-1.5 font-semibold text-red-500">-₦12,000</td>
                  <td className="py-1.5 font-semibold text-green-600">₦188,000</td>
                </tr>
                <tr className="border-t border-gray-50">
                  <td className="py-1.5 font-semibold text-gray-800">Annual</td>
                  <td className="py-1.5 font-semibold text-gray-800">₦2,400,000</td>
                  <td className="py-1.5 font-semibold text-red-500">-₦144,000</td>
                  <td className="py-1.5 font-semibold text-green-600">₦2,256,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-[#254C00] px-6 text-[#254C00] hover:bg-[#254C00] hover:text-white"
          >
            Back
          </Button>
          <div className="ml-auto flex gap-3">
            <Button variant="outline" className="rounded-full px-6">
              <DownloadIcon className="mr-2 size-4" />
              Download PDF
            </Button>
            <Button className="rounded-full bg-[#3300C9] px-8 text-white hover:bg-[#3300C9]/90">
              Edit Salary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSalaryBreakdown, setShowSalaryBreakdown] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [docCategory, setDocCategory] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // Date picker popovers
  const [dobOpen, setDobOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);

  // Personal info form state
  const [personalForm, setPersonalForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: null,
    department: '',
    employmentType: '',
    jobTitle: '',
    homeAddress: '',
    startDate: null,
    lineManager: '',
  });

  // Payroll form state
  const [payrollForm, setPayrollForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    salaryAmount: '',
    taxId: '',
    bvn: '',
    payrollStatus: 'Active',
  });

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        setIsLoading(true);
        const [empRes, deptRes] = await Promise.all([
          EmployeeService.get({ id }),
          EmployeeService.getDepartments(),
        ]);
        const emp = empRes.data?.data || empRes.data || {};
        setEmployee(emp);
        setDepartments(deptRes.data?.data || []);

        setPersonalForm({
          employeeId: emp.employeeId || emp._id || '',
          name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          email: emp.email || '',
          phone: emp.phoneNumber || emp.phone || '',
          gender: emp.gender || '',
          dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null,
          department: emp.departmentName || emp.department || '',
          employmentType:
            emp.employmentType === 'FULL_TIME'
              ? 'Full-time'
              : emp.employmentType === 'PART_TIME'
                ? 'Part-time'
                : emp.employmentType === 'CONTRACT'
                  ? 'Contract'
                  : emp.employmentType === 'INTERN'
                    ? 'Intern'
                    : emp.employmentType || '',
          jobTitle: emp.positionTitle || emp.position || '',
          homeAddress: emp.address?.address1 || emp.homeAddress || '',
          startDate: emp.hireDate ? new Date(emp.hireDate) : null,
          lineManager: emp.lineManager || '',
        });

        setPayrollForm({
          bankName: emp.bankName || '',
          accountName: emp.accountName || '',
          accountNumber: emp.accountNumber || '',
          salaryAmount: emp.salary ? `₦${Number(emp.salary).toLocaleString()}` : '',
          taxId: emp.taxId || '',
          bvn: emp.bvn || '',
          payrollStatus: emp.payrollStatus || 'Active',
        });
      } catch (err) {
        console.error('Error fetching employee:', err);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleSavePersonal = async () => {
    try {
      setIsSaving(true);
      const nameParts = personalForm.name.trim().split(' ');
      await EmployeeService.update({
        id,
        data: {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: personalForm.email,
          phoneNumber: personalForm.phone,
          gender: personalForm.gender,
          dateOfBirth: personalForm.dateOfBirth,
          department: personalForm.department,
          employmentType: personalForm.employmentType,
          position: personalForm.jobTitle,
          address: { address1: personalForm.homeAddress },
          hireDate: personalForm.startDate,
          lineManager: personalForm.lineManager,
        },
      });
      toast.success('Employee details updated');
      setIsEditing(false);
      const empRes = await EmployeeService.get({ id });
      setEmployee(empRes.data?.data || empRes.data);
    } catch (err) {
      console.error('Error saving personal info:', err);
      toast.error('Failed to update employee details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayroll = async () => {
    try {
      setIsSaving(true);
      await EmployeeService.update({
        id,
        data: {
          bankName: payrollForm.bankName,
          accountName: payrollForm.accountName,
          accountNumber: payrollForm.accountNumber,
          salary: parseFloat(payrollForm.salaryAmount.replace(/[₦,]/g, '')) || 0,
          taxId: payrollForm.taxId,
          bvn: payrollForm.bvn,
          payrollStatus: payrollForm.payrollStatus,
        },
      });
      toast.success('Payroll details updated');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving payroll info:', err);
      toast.error('Failed to update payroll details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newDocs = files.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      category: docCategory || 'Personal',
    }));
    setUploadedDocs((prev) => [...prev, ...newDocs]);
    toast.success('Document(s) uploaded successfully');
    e.target.value = '';
  };

  // ── Derived display values ────────────────────────────────────────────────
  const rawStatus = employee?.status || 'ACTIVE';
  const displayStatus =
    rawStatus === 'ACTIVE'
      ? 'Active'
      : rawStatus === 'ON_LEAVE'
        ? 'On Leave'
        : rawStatus === 'TERMINATED'
          ? 'Terminated'
          : 'Inactive';

  const displayName = employee
    ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
    : '';
  const displayJobTitle = employee?.positionTitle || employee?.position || '';
  const displayDept = employee?.departmentName || employee?.department || '';
  const displayDate = employee?.hireDate
    ? format(new Date(employee.hireDate), 'MMMM d, yyyy.')
    : '';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ── Header action button ──────────────────────────────────────────────────
  const renderActionButton = () => {
    if (activeTab === 'documents') {
      return (
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="h-10 gap-2 rounded-lg bg-[#6C2BD9] px-5 text-sm font-medium text-white hover:bg-[#5A23B8]"
        >
          <UploadCloudIcon className="size-4" />
          Upload Document
        </Button>
      );
    }
    if (isEditing) {
      return (
        <Button
          onClick={activeTab === 'personal' ? handleSavePersonal : handleSavePayroll}
          disabled={isSaving}
          className="h-10 gap-2 rounded-lg bg-[#6C2BD9] px-5 text-sm font-medium text-white hover:bg-[#5A23B8]"
        >
          <SaveIcon className="size-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      );
    }
    return (
      <Button
        onClick={() => setIsEditing(true)}
        className="h-10 gap-2 rounded-lg bg-[#6C2BD9] px-5 text-sm font-medium text-white hover:bg-[#5A23B8]"
      >
        <PencilIcon className="size-4" />
        Edit Profile
      </Button>
    );
  };

  // ── Personal Info Tab ─────────────────────────────────────────────────────
  const renderPersonalView = () => (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
      <div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-6">
        <FieldRow icon={CreditCardIcon} label="Employee ID" value={personalForm.employeeId} />
        <FieldRow icon={UserIcon} label="Name" value={personalForm.name} />
        <FieldRow icon={MailIcon} label="Email Address" value={personalForm.email} />
        <FieldRow icon={PhoneIcon} label="Phone" value={personalForm.phone} />
        <FieldRow icon={UserIcon} label="Gender" value={personalForm.gender} />
        <FieldRow
          icon={CalendarIcon}
          label="Date of Birth"
          value={
            personalForm.dateOfBirth
              ? format(personalForm.dateOfBirth, 'MMMM d, yyyy')
              : '-'
          }
        />
        <FieldRow icon={BriefcaseIcon} label="Job Title" value={personalForm.jobTitle} />
        <FieldRow icon={BuildingIcon} label="Department" value={personalForm.department} />
        <FieldRow icon={ClockIcon} label="Employment Type" value={personalForm.employmentType} />
        <FieldRow icon={MapPinIcon} label="Home Address" value={personalForm.homeAddress} />
        <FieldRow
          icon={CalendarIcon}
          label="Start Date"
          value={
            personalForm.startDate
              ? format(personalForm.startDate, 'MMMM d, yyyy.')
              : '-'
          }
        />
        <FieldRow icon={UserIcon} label="Line Manager" value={personalForm.lineManager} />
      </div>
    </div>
  );

  const renderPersonalEdit = () => (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
      <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-5">
        {/* Employee ID — read-only */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Employee ID</label>
          <Input value={personalForm.employeeId} disabled className="h-11 bg-gray-50" />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Name</label>
          <Input
            placeholder="e.g. John Doe"
            value={personalForm.name}
            onChange={(e) => setPersonalForm((p) => ({ ...p, name: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            placeholder="e.g. hammedadeyanju75@gmail.com"
            value={personalForm.email}
            onChange={(e) => setPersonalForm((p) => ({ ...p, email: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Phone</label>
          <Input
            placeholder="e.g +2349068114071"
            value={personalForm.phone}
            onChange={(e) => setPersonalForm((p) => ({ ...p, phone: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Gender</label>
          <Select
            value={personalForm.gender}
            onValueChange={(val) => setPersonalForm((p) => ({ ...p, gender: val }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Date of Birth</label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-11 w-full justify-start text-left font-normal',
                  !personalForm.dateOfBirth && 'text-muted-foreground',
                )}
              >
                {personalForm.dateOfBirth
                  ? format(personalForm.dateOfBirth, 'dd/MM/yyyy')
                  : 'Pick a date'}
                <CalendarIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalForm.dateOfBirth}
                onSelect={(date) => {
                  setPersonalForm((p) => ({ ...p, dateOfBirth: date }));
                  setDobOpen(false);
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Department</label>
          <Select
            value={personalForm.department}
            onValueChange={(val) => setPersonalForm((p) => ({ ...p, department: val }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.length > 0 ? (
                departments.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Employment Type</label>
          <Select
            value={personalForm.employmentType}
            onValueChange={(val) => setPersonalForm((p) => ({ ...p, employmentType: val }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Intern">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Job Title</label>
          <Input
            placeholder="e.g Senior Software Engineer"
            value={personalForm.jobTitle}
            onChange={(e) => setPersonalForm((p) => ({ ...p, jobTitle: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Home Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Home Address</label>
          <Input
            placeholder="e.g Lagos, Nigeria"
            value={personalForm.homeAddress}
            onChange={(e) => setPersonalForm((p) => ({ ...p, homeAddress: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Start Date</label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-11 w-full justify-start text-left font-normal',
                  !personalForm.startDate && 'text-muted-foreground',
                )}
              >
                {personalForm.startDate
                  ? format(personalForm.startDate, 'dd/MM/yyyy')
                  : 'Pick a date'}
                <CalendarIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalForm.startDate}
                onSelect={(date) => {
                  setPersonalForm((p) => ({ ...p, startDate: date }));
                  setStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Line Manager */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Line Manager</label>
          <Input
            placeholder="e.g. John Doe"
            value={personalForm.lineManager}
            onChange={(e) => setPersonalForm((p) => ({ ...p, lineManager: e.target.value }))}
            className="h-11"
          />
        </div>
      </div>
    </div>
  );

  // ── Payroll Tab ───────────────────────────────────────────────────────────
  const renderPayrollView = () => (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="text-base font-semibold text-gray-900">Bank & Payroll</h3>
      <div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-6">
        <FieldRow
          icon={LandmarkIcon}
          label="Bank Name"
          value={payrollForm.bankName || 'First Bank Plc'}
        />
        <FieldRow
          icon={UserIcon}
          label="Account Name"
          value={payrollForm.accountName || 'Hammed Adeyanju'}
        />
        <FieldRow
          icon={CreditCardIcon}
          label="Account Number"
          value={payrollForm.accountNumber || '.... .... .... 4589'}
        />

        {/* Monthly Salary with View Breakdown link */}
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">Monthly Salary</p>
          <div className="flex items-center gap-2 text-sm text-gray-800">
            <BanknoteIcon className="size-4 shrink-0 text-gray-400" />
            <span>{payrollForm.salaryAmount || '₦15,000,000'}</span>
            <button
              onClick={() => setShowSalaryBreakdown(true)}
              className="flex items-center gap-0.5 text-xs font-medium text-[#6C2BD9] hover:underline"
            >
              View Breakdown
              <ArrowUpRightIcon className="size-3" />
            </button>
          </div>
        </div>

        <FieldRow
          icon={FileTextIcon}
          label="Tax ID"
          value={payrollForm.taxId || '123-45-6789'}
        />
        <FieldRow icon={WalletIcon} label="BVN" value={payrollForm.bvn || '123-45-6789'} />

        {/* Payroll Status */}
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">Payroll Status</p>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              payrollForm.payrollStatus === 'Active'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600',
            )}
          >
            {payrollForm.payrollStatus || 'Active'}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPayrollEdit = () => (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="text-base font-semibold text-gray-900">Bank & Payroll</h3>
      <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Bank Name</label>
          <Input
            placeholder="e.g. First Bank Plc"
            value={payrollForm.bankName}
            onChange={(e) => setPayrollForm((p) => ({ ...p, bankName: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Account Name</label>
          <Input
            placeholder="e.g. Hammed Adeyanju"
            value={payrollForm.accountName}
            onChange={(e) => setPayrollForm((p) => ({ ...p, accountName: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Account Number</label>
          <Input
            placeholder="e.g .... .... .... 4589"
            value={payrollForm.accountNumber}
            onChange={(e) => setPayrollForm((p) => ({ ...p, accountNumber: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Salary Amount</label>
          <Input
            placeholder="e.g ₦15,000,000"
            value={payrollForm.salaryAmount}
            onChange={(e) => setPayrollForm((p) => ({ ...p, salaryAmount: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Tax ID</label>
          <Input
            placeholder="123-45-6789"
            value={payrollForm.taxId}
            onChange={(e) => setPayrollForm((p) => ({ ...p, taxId: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">BVN</label>
          <Input
            placeholder="123-45-6789"
            value={payrollForm.bvn}
            onChange={(e) => setPayrollForm((p) => ({ ...p, bvn: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700">Payroll Status</label>
          <Select
            value={payrollForm.payrollStatus}
            onValueChange={(val) => setPayrollForm((p) => ({ ...p, payrollStatus: val }))}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // ── Documents Tab ─────────────────────────────────────────────────────────
  const renderDocuments = () => (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6">
      {/* Document Category */}
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-800">
          Document Category
        </label>
        <Select value={docCategory} onValueChange={setDocCategory}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="e.g Offer Letter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Contract of Employment">Contract of Employment</SelectItem>
            <SelectItem value="Certificate">Certificate</SelectItem>
            <SelectItem value="Offer Letter">Offer Letter</SelectItem>
            <SelectItem value="Tax">Tax</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upload Drop Zone */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-800">
          Upload Document
        </label>
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white py-10 transition-colors hover:border-gray-300 hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            if (!files.length) return;
            const newDocs = files.map((f) => ({
              id: `${Date.now()}-${Math.random()}`,
              name: f.name,
              category: docCategory || 'Personal',
            }));
            setUploadedDocs((prev) => [...prev, ...newDocs]);
            toast.success('Document(s) uploaded successfully');
          }}
        >
          <InboxIcon className="mb-3 size-12 text-[#254C00]" />
          <p className="text-sm font-medium text-gray-700">
            Click or drag file to this area to upload
          </p>
          <p className="mt-1 text-xs text-gray-400">Support for a single or bulk upload.</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Uploaded Documents */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-800">Uploaded Documents</h4>
        {uploadedDocs.length === 0 ? (
          <div className="rounded-lg border border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-400">No document yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-100">
                    <FileTextIcon className="size-4 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-800">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.category}</p>
                  </div>
                </div>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="size-3.5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() =>
                      setUploadedDocs((prev) => prev.filter((d) => d.id !== doc.id))
                    }
                  >
                    <Trash2Icon className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="my-8 flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Loading employee details...</p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Tab nav — replaces HR layout tabs for this route */}
      <div className="mt-2.5 flex items-center gap-6 overflow-x-auto border-b-2 border-[#D9D9D9] pt-4">
        {TABS.map((tab) => (
          <span
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`cursor-pointer text-nowrap pb-2.5 text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary border-b-2'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="my-4 min-h-screen">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard/hr/employee-directory')}
          className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <ArrowLeftIcon className="size-5" />
          Employee Details
        </button>

        {/* Employee header card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <Avatar className="size-20 shrink-0 ring-2 ring-purple-100">
              <AvatarImage src={employee?.avatarUrl || employee?.photo} alt={displayName} />
              <AvatarFallback className="bg-purple-100 text-lg font-semibold text-purple-700">
                {initials || 'EE'}
              </AvatarFallback>
            </Avatar>

            {/* Name & info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{displayName || '—'}</h2>
              <p className="mt-0.5 text-sm text-gray-500">{displayJobTitle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                {displayDept && (
                  <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-4 text-gray-400" />
                    {displayDept}
                  </span>
                )}
                {displayDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4 text-gray-400" />
                    {displayDate}
                  </span>
                )}
              </div>
            </div>

            {/* Status + Action */}
            <div className="flex flex-col items-end gap-3">
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  STATUS_STYLES[displayStatus],
                )}
              >
                {displayStatus}
              </span>
              {renderActionButton()}
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'personal' &&
          (isEditing ? renderPersonalEdit() : renderPersonalView())}
        {activeTab === 'payroll' &&
          (isEditing ? renderPayrollEdit() : renderPayrollView())}
        {activeTab === 'documents' && renderDocuments()}
      </div>

      {/* Salary Breakdown Modal */}
      <SalaryBreakdownModal
        open={showSalaryBreakdown}
        onOpenChange={setShowSalaryBreakdown}
      />
    </>
  );
}
