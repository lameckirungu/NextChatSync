import { useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { personalInfoSchema, educationInfoSchema, programInfoSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DocumentUpload } from '@/components/ui/document-upload';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

// Combine all schemas for the full application
const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  educationInfo: educationInfoSchema,
  programInfo: programInfoSchema,
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Component for Step 1: Personal Information
const PersonalInformationStep = () => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 mb-6">Personal Information</h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="personalInfo.firstName">First Name</Label>
          <Controller
            name="personalInfo.firstName"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.firstName"
                {...field}
                className="mt-1"
                error={errors.personalInfo?.firstName?.message}
              />
            )}
          />
          {errors.personalInfo?.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personalInfo.lastName">Last Name</Label>
          <Controller
            name="personalInfo.lastName"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.lastName"
                {...field}
                className="mt-1"
                error={errors.personalInfo?.lastName?.message}
              />
            )}
          />
          {errors.personalInfo?.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personalInfo.dob">Date of Birth</Label>
          <Controller
            name="personalInfo.dob"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.dob"
                {...field}
                type="date"
                className="mt-1"
                error={errors.personalInfo?.dob?.message}
              />
            )}
          />
          {errors.personalInfo?.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.dob.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personalInfo.phone">Phone Number</Label>
          <Controller
            name="personalInfo.phone"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.phone"
                {...field}
                type="tel"
                className="mt-1"
                error={errors.personalInfo?.phone?.message}
              />
            )}
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
          )}
        </div>
        
        <div className="sm:col-span-2">
          <Label htmlFor="personalInfo.address">Address</Label>
          <Controller
            name="personalInfo.address"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.address"
                {...field}
                className="mt-1"
                error={errors.personalInfo?.address?.message}
              />
            )}
          />
          {errors.personalInfo?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personalInfo.city">City</Label>
          <Controller
            name="personalInfo.city"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.city"
                {...field}
                className="mt-1"
                error={errors.personalInfo?.city?.message}
              />
            )}
          />
          {errors.personalInfo?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.city.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="personalInfo.zipCode">ZIP / Postal Code</Label>
          <Controller
            name="personalInfo.zipCode"
            control={control}
            render={({ field }) => (
              <Input
                id="personalInfo.zipCode"
                {...field}
                className="mt-1"
                error={errors.personalInfo?.zipCode?.message}
              />
            )}
          />
          {errors.personalInfo?.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.zipCode.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Step 2: Education History
const EducationHistoryStep = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ApplicationFormValues>();
  const hasPreviousCollege = watch('educationInfo.college.attended');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 mb-6">Education History</h3>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-md font-medium text-slate-700 mb-4">High School Information</h4>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="educationInfo.highSchool.name">High School Name</Label>
                <Controller
                  name="educationInfo.highSchool.name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.name"
                      {...field}
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.name?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="educationInfo.highSchool.city">City</Label>
                <Controller
                  name="educationInfo.highSchool.city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.city"
                      {...field}
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.city?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.city.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="educationInfo.highSchool.state">State/Province</Label>
                <Controller
                  name="educationInfo.highSchool.state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.state"
                      {...field}
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.state?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.state.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="educationInfo.highSchool.startDate">Start Date</Label>
                <Controller
                  name="educationInfo.highSchool.startDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.startDate"
                      {...field}
                      type="month"
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.startDate?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.startDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="educationInfo.highSchool.endDate">End Date</Label>
                <Controller
                  name="educationInfo.highSchool.endDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.endDate"
                      {...field}
                      type="month"
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.endDate?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.endDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="educationInfo.highSchool.gpa">GPA</Label>
                <Controller
                  name="educationInfo.highSchool.gpa"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="educationInfo.highSchool.gpa"
                      {...field}
                      className="mt-1"
                      error={errors.educationInfo?.highSchool?.gpa?.message}
                    />
                  )}
                />
                {errors.educationInfo?.highSchool?.gpa && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationInfo.highSchool.gpa.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <h4 className="text-md font-medium text-slate-700 mb-4">Previous College (if applicable)</h4>
          <div className="flex items-center space-x-2">
            <Controller
              name="educationInfo.college.attended"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="hasPreviousCollege"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (!checked) {
                      // Reset college fields if unchecked
                      setValue('educationInfo.college.name', '');
                      setValue('educationInfo.college.city', '');
                      setValue('educationInfo.college.state', '');
                      setValue('educationInfo.college.startDate', '');
                      setValue('educationInfo.college.endDate', '');
                      setValue('educationInfo.college.gpa', '');
                    }
                  }}
                />
              )}
            />
            <Label htmlFor="hasPreviousCollege">I have previously attended college</Label>
          </div>
          
          {hasPreviousCollege && (
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="educationInfo.college.name">College Name</Label>
                    <Controller
                      name="educationInfo.college.name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.name"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="educationInfo.college.city">City</Label>
                    <Controller
                      name="educationInfo.college.city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.city"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="educationInfo.college.state">State/Province</Label>
                    <Controller
                      name="educationInfo.college.state"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.state"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="educationInfo.college.startDate">Start Date</Label>
                    <Controller
                      name="educationInfo.college.startDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.startDate"
                          {...field}
                          type="month"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="educationInfo.college.endDate">End Date</Label>
                    <Controller
                      name="educationInfo.college.endDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.endDate"
                          {...field}
                          type="month"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="educationInfo.college.gpa">GPA</Label>
                    <Controller
                      name="educationInfo.college.gpa"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="educationInfo.college.gpa"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Step 3: Course Selection
const CourseSelectionStep = () => {
  const { control, formState: { errors } } = useFormContext<ApplicationFormValues>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 mb-6">Course Selection</h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="programInfo.type">Program Type</Label>
          <Controller
            name="programInfo.type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.programInfo?.type && (
            <p className="mt-1 text-sm text-red-600">{errors.programInfo.type.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="programInfo.major">Intended Major</Label>
          <Controller
            name="programInfo.major"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select intended major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computerScience">Computer Science</SelectItem>
                  <SelectItem value="business">Business Administration</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="arts">Liberal Arts</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.programInfo?.major && (
            <p className="mt-1 text-sm text-red-600">{errors.programInfo.major.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="programInfo.startTerm">Start Term</Label>
          <Controller
            name="programInfo.startTerm"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select start term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall2023">Fall 2023</SelectItem>
                  <SelectItem value="spring2024">Spring 2024</SelectItem>
                  <SelectItem value="fall2024">Fall 2024</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.programInfo?.startTerm && (
            <p className="mt-1 text-sm text-red-600">{errors.programInfo.startTerm.message}</p>
          )}
        </div>
        
        <div>
          <Label>Campus Preference</Label>
          <Controller
            name="programInfo.campus"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="main" id="campusMain" />
                  <Label htmlFor="campusMain">Main Campus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="downtown" id="campusDowntown" />
                  <Label htmlFor="campusDowntown">Downtown Campus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="campusOnline" />
                  <Label htmlFor="campusOnline">Online</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.programInfo?.campus && (
            <p className="mt-1 text-sm text-red-600">{errors.programInfo.campus.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="programInfo.question">Why do you want to study at our institution?</Label>
          <Controller
            name="programInfo.question"
            control={control}
            render={({ field }) => (
              <Textarea
                id="programInfo.question"
                {...field}
                rows={4}
                className="mt-1"
                error={errors.programInfo?.question?.message}
              />
            )}
          />
          {errors.programInfo?.question && (
            <p className="mt-1 text-sm text-red-600">{errors.programInfo.question.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Step 4: Documents
const DocumentsStep = ({ applicationId }: { applicationId?: number }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 mb-6">Required Documents</h3>
      
      <div className="space-y-6">
        {applicationId ? (
          <>
            <DocumentUpload
              label="Transcript"
              documentType="transcript"
              applicationId={applicationId}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
              required
            />
            
            <DocumentUpload
              label="Personal Statement"
              documentType="personal_statement"
              applicationId={applicationId}
              accept=".pdf,.doc,.docx"
              maxSize={10}
              required
            />
            
            <DocumentUpload
              label="Additional Documents (Optional)"
              documentType="additional"
              applicationId={applicationId}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              maxSize={10}
            />
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Please save your application first to enable document uploads.
          </div>
        )}
      </div>
    </div>
  );
};

// Default form values
const defaultFormValues: ApplicationFormValues = {
  personalInfo: {
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  },
  educationInfo: {
    highSchool: {
      name: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      gpa: '',
    },
    college: {
      attended: false,
    }
  },
  programInfo: {
    type: '',
    major: '',
    startTerm: '',
    campus: 'main',
    question: '',
  }
};

interface ApplicationFormProps {
  application?: {
    id: number;
    status: string;
    form_data: any;
  };
  onSaveDraft?: () => void;
  onSubmit?: () => void;
}

export function ApplicationForm({ application, onSaveDraft, onSubmit }: ApplicationFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with application data if it exists
  const initialFormValues = application?.form_data 
    ? application.form_data as ApplicationFormValues
    : defaultFormValues;

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: initialFormValues,
    mode: 'onBlur',
  });
  
  const { handleSubmit, formState, getValues, reset } = methods;

  const totalSteps = 4;
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  
  const saveDraft = async () => {
    try {
      setIsSaving(true);
      const formData = getValues();
      
      if (application?.id) {
        // Update existing application
        await apiRequest('PUT', `/api/applications/${application.id}`, {
          form_data: formData,
        });
        
        toast({
          title: 'Draft saved',
          description: 'Your application has been saved as a draft.',
        });
      } else {
        // Create new application
        const response = await apiRequest('POST', '/api/applications', {
          status: 'draft',
          form_data: formData,
        });
        
        const newApplication = await response.json();
        
        toast({
          title: 'Draft created',
          description: 'Your application has been created and saved as a draft.',
        });
        
        // Refresh applications list and navigate to the new application
        queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
        navigate(`/dashboard/application?id=${newApplication.id}`);
      }
      
      if (onSaveDraft) onSaveDraft();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error saving draft',
        description: 'There was an error saving your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const submitApplication = async (data: ApplicationFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!application?.id) {
        // Create new application and submit it
        const response = await apiRequest('POST', '/api/applications', {
          status: 'submitted',
          form_data: data,
        });
        
        const newApplication = await response.json();
        
        toast({
          title: 'Application submitted',
          description: 'Your application has been submitted successfully.',
        });
        
        // Refresh applications list and navigate to dashboard
        queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
        navigate('/dashboard');
      } else {
        // Update existing application and change status to submitted
        await apiRequest('PUT', `/api/applications/${application.id}`, {
          form_data: data,
        });
        
        await apiRequest('PUT', `/api/applications/${application.id}/status`, {
          status: 'submitted',
        });
        
        toast({
          title: 'Application submitted',
          description: 'Your application has been submitted successfully.',
        });
        
        // Refresh applications list and navigate to dashboard
        queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
        navigate('/dashboard');
      }
      
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error submitting application',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isStepValid = (step: number) => {
    const { errors } = formState;
    switch (step) {
      case 1:
        return !errors.personalInfo;
      case 2:
        return !errors.educationInfo;
      case 3:
        return !errors.programInfo;
      default:
        return true;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitApplication)}>
        {/* Progress Steps */}
        <div className="px-4 py-4 sm:px-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <button 
              type="button" 
              className={`text-sm font-medium ${currentStep === 1 ? 'text-primary-600' : 'text-slate-500'} step-btn`}
              onClick={() => goToStep(1)}
            >
              Personal Information
            </button>
            <div className={`h-1 w-8 bg-${isStepValid(1) ? 'primary-500' : 'slate-200'} rounded sm:w-16`}></div>
            
            <button 
              type="button" 
              className={`text-sm font-medium ${currentStep === 2 ? 'text-primary-600' : 'text-slate-500'} step-btn`}
              onClick={() => goToStep(2)}
            >
              Education History
            </button>
            <div className={`h-1 w-8 bg-${isStepValid(2) ? 'primary-500' : 'slate-200'} rounded sm:w-16`}></div>
            
            <button 
              type="button" 
              className={`text-sm font-medium ${currentStep === 3 ? 'text-primary-600' : 'text-slate-500'} step-btn`}
              onClick={() => goToStep(3)}
            >
              Course Selection
            </button>
            <div className={`h-1 w-8 bg-${isStepValid(3) ? 'primary-500' : 'slate-200'} rounded sm:w-16`}></div>
            
            <button 
              type="button" 
              className={`text-sm font-medium ${currentStep === 4 ? 'text-primary-600' : 'text-slate-500'} step-btn`}
              onClick={() => goToStep(4)}
            >
              Documents
            </button>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Step 1: Personal Information */}
          <div className={currentStep === 1 ? '' : 'hidden'}>
            <PersonalInformationStep />
          </div>
          
          {/* Step 2: Education History */}
          <div className={currentStep === 2 ? '' : 'hidden'}>
            <EducationHistoryStep />
          </div>
          
          {/* Step 3: Course Selection */}
          <div className={currentStep === 3 ? '' : 'hidden'}>
            <CourseSelectionStep />
          </div>
          
          {/* Step 4: Documents */}
          <div className={currentStep === 4 ? '' : 'hidden'}>
            <DocumentsStep applicationId={application?.id} />
          </div>
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
              >
                Back: {
                  currentStep === 2 ? 'Personal Information' :
                  currentStep === 3 ? 'Education History' :
                  'Course Selection'
                }
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={goToNextStep}
              >
                Next: {
                  currentStep === 1 ? 'Education History' :
                  currentStep === 2 ? 'Course Selection' :
                  'Documents'
                }
              </Button>
            ) : (
              <div className="space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
