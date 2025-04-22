import { useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  personalInfoSchema, 
  educationInfoSchema, 
  programInfoSchema,
  medicalInfoSchema,
  interestsSchema,
  accommodationSchema,
  documentsSchema
} from '@shared/schema';
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
  medicalInfo: medicalInfoSchema,
  interests: interestsSchema,
  accommodation: accommodationSchema,
  documents: documentsSchema,
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Component for Step 1: Personal Information
const PersonalInformationStep = () => {
  const { control, watch, formState: { errors } } = useFormContext<ApplicationFormValues>();
  const hasDisability = watch('personalInfo.hasDisability');
  const maritalStatus = watch('personalInfo.maritalStatus');
  const fatherIsAlive = watch('personalInfo.fatherDetails.isAlive');
  const motherIsAlive = watch('personalInfo.motherDetails.isAlive');

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-primary-700 mb-4">Personal Information</h3>
      
      {/* Basic Personal Details */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Basic Details</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="personalInfo.surname">Surname</Label>
              <Controller
                name="personalInfo.surname"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.surname"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.surname && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.surname.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.middleName">Middle Name</Label>
              <Controller
                name="personalInfo.middleName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.middleName"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.middleName && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.middleName.message as string}</p>
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
                  />
                )}
              />
              {errors.personalInfo?.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.nationalIdNumber">National ID/Birth Certificate Number</Label>
              <Controller
                name="personalInfo.nationalIdNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.nationalIdNumber"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.nationalIdNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.nationalIdNumber.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.huduma">Huduma Number (Optional)</Label>
              <Controller
                name="personalInfo.huduma"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.huduma"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
            </div>
            
            <div>
              <Label htmlFor="personalInfo.dateOfBirth">Date of Birth</Label>
              <Controller
                name="personalInfo.dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.dateOfBirth"
                    {...field}
                    type="date"
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.dateOfBirth.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.gender">Gender</Label>
              <Controller
                name="personalInfo.gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.personalInfo?.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.gender.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.birthPlace">Place of Birth</Label>
              <Controller
                name="personalInfo.birthPlace"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.birthPlace"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.birthPlace && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.birthPlace.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.nationality">Nationality</Label>
              <Controller
                name="personalInfo.nationality"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.nationality"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.nationality && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.nationality.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.religion">Religion (Optional)</Label>
              <Controller
                name="personalInfo.religion"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.religion"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
            </div>
            
            <div>
              <Label htmlFor="personalInfo.nhifNumber">NHIF Card Number</Label>
              <Controller
                name="personalInfo.nhifNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.nhifNumber"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.nhifNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.nhifNumber.message as string}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex items-center space-x-2 mt-4">
                <Controller
                  name="personalInfo.hasDisability"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="hasDisability"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="hasDisability">Do you have any disability?</Label>
              </div>
              
              {hasDisability && (
                <div className="mt-2">
                  <Label htmlFor="personalInfo.disabilityDetails">Please provide details</Label>
                  <Controller
                    name="personalInfo.disabilityDetails"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="personalInfo.disabilityDetails"
                        {...field}
                        className="mt-1"
                        rows={3}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Contact Details */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="personalInfo.phoneNumber">Phone Number</Label>
              <Controller
                name="personalInfo.phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.phoneNumber"
                    {...field}
                    type="tel"
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phoneNumber.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.email">Email</Label>
              <Controller
                name="personalInfo.email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.email"
                    {...field}
                    type="email"
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.contactAddress.poBox">P.O. Box</Label>
              <Controller
                name="personalInfo.contactAddress.poBox"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.contactAddress.poBox"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.contactAddress?.poBox && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.contactAddress.poBox.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.contactAddress.postalCode">Postal Code</Label>
              <Controller
                name="personalInfo.contactAddress.postalCode"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.contactAddress.postalCode"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.contactAddress?.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.contactAddress.postalCode.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.contactAddress.town">Town</Label>
              <Controller
                name="personalInfo.contactAddress.town"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.contactAddress.town"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.contactAddress?.town && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.contactAddress.town.message as string}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Permanent Residence */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Permanent Residence</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="personalInfo.permanentResidence.village">Village/Town</Label>
              <Controller
                name="personalInfo.permanentResidence.village"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.village"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.village && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.village.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.nearestTown">Nearest Town</Label>
              <Controller
                name="personalInfo.permanentResidence.nearestTown"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.nearestTown"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.nearestTown && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.nearestTown.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.location">Location</Label>
              <Controller
                name="personalInfo.permanentResidence.location"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.location"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.location && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.location.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.chiefName">Chief's Name</Label>
              <Controller
                name="personalInfo.permanentResidence.chiefName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.chiefName"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.chiefName && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.chiefName.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.county">County</Label>
              <Controller
                name="personalInfo.permanentResidence.county"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.county"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.county && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.county.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.subCounty">Sub-County</Label>
              <Controller
                name="personalInfo.permanentResidence.subCounty"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.subCounty"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.subCounty && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.subCounty.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.constituency">Constituency</Label>
              <Controller
                name="personalInfo.permanentResidence.constituency"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.constituency"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.constituency && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.constituency.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="personalInfo.permanentResidence.nearestPoliceStation">Nearest Police Station</Label>
              <Controller
                name="personalInfo.permanentResidence.nearestPoliceStation"
                control={control}
                render={({ field }) => (
                  <Input
                    id="personalInfo.permanentResidence.nearestPoliceStation"
                    {...field}
                    className="mt-1"
                  />
                )}
              />
              {errors.personalInfo?.permanentResidence?.nearestPoliceStation && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.permanentResidence.nearestPoliceStation.message as string}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Marital Status */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Marital Status</h4>
          <div className="space-y-4">
            <Controller
              name="personalInfo.maritalStatus"
              control={control}
              render={({ field }) => (
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value} 
                  className="flex flex-wrap gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Single" id="status-single" />
                    <Label htmlFor="status-single">Single</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Married" id="status-married" />
                    <Label htmlFor="status-married">Married</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Divorced" id="status-divorced" />
                    <Label htmlFor="status-divorced">Divorced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Widowed" id="status-widowed" />
                    <Label htmlFor="status-widowed">Widowed</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.personalInfo?.maritalStatus && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.maritalStatus.message as string}</p>
            )}
            
            {(maritalStatus === 'Married') && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4 p-4 bg-slate-50 rounded-md">
                <div>
                  <Label htmlFor="personalInfo.spouseDetails.name">Spouse's Name</Label>
                  <Controller
                    name="personalInfo.spouseDetails.name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="personalInfo.spouseDetails.name"
                        {...field}
                        className="mt-1"
                      />
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="personalInfo.spouseDetails.occupation">Spouse's Occupation</Label>
                  <Controller
                    name="personalInfo.spouseDetails.occupation"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="personalInfo.spouseDetails.occupation"
                        {...field}
                        className="mt-1"
                      />
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="personalInfo.spouseDetails.phoneNumber">Spouse's Phone Number</Label>
                  <Controller
                    name="personalInfo.spouseDetails.phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="personalInfo.spouseDetails.phoneNumber"
                        {...field}
                        type="tel"
                        className="mt-1"
                      />
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="personalInfo.spouseDetails.childrenCount">Number of Children</Label>
                  <Controller
                    name="personalInfo.spouseDetails.childrenCount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="personalInfo.spouseDetails.childrenCount"
                        {...field}
                        type="number"
                        min="0"
                        className="mt-1"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Family Background */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Family Background</h4>
          
          {/* Father's Details */}
          <div className="space-y-4 mb-6">
            <h5 className="text-md font-medium text-slate-700">Father's Details</h5>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="personalInfo.fatherDetails.name">Father's Name</Label>
                <Controller
                  name="personalInfo.fatherDetails.name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.fatherDetails.name"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.fatherDetails?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fatherDetails.name.message as string}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <Controller
                  name="personalInfo.fatherDetails.isAlive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="fatherIsAlive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="fatherIsAlive">Is your father alive?</Label>
              </div>
              
              {fatherIsAlive && (
                <>
                  <div>
                    <Label htmlFor="personalInfo.fatherDetails.occupation">Father's Occupation</Label>
                    <Controller
                      name="personalInfo.fatherDetails.occupation"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="personalInfo.fatherDetails.occupation"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="personalInfo.fatherDetails.dateOfBirth">Father's Date of Birth</Label>
                    <Controller
                      name="personalInfo.fatherDetails.dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="personalInfo.fatherDetails.dateOfBirth"
                          {...field}
                          type="date"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Mother's Details */}
          <div className="space-y-4 mb-6">
            <h5 className="text-md font-medium text-slate-700">Mother's Details</h5>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="personalInfo.motherDetails.name">Mother's Name</Label>
                <Controller
                  name="personalInfo.motherDetails.name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.motherDetails.name"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.motherDetails?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.motherDetails.name.message as string}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <Controller
                  name="personalInfo.motherDetails.isAlive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="motherIsAlive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="motherIsAlive">Is your mother alive?</Label>
              </div>
              
              {motherIsAlive && (
                <>
                  <div>
                    <Label htmlFor="personalInfo.motherDetails.occupation">Mother's Occupation</Label>
                    <Controller
                      name="personalInfo.motherDetails.occupation"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="personalInfo.motherDetails.occupation"
                          {...field}
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="personalInfo.motherDetails.dateOfBirth">Mother's Date of Birth</Label>
                    <Controller
                      name="personalInfo.motherDetails.dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="personalInfo.motherDetails.dateOfBirth"
                          {...field}
                          type="date"
                          className="mt-1"
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Number of siblings */}
          <div>
            <Label htmlFor="personalInfo.siblingsCount">Number of Siblings</Label>
            <Controller
              name="personalInfo.siblingsCount"
              control={control}
              render={({ field }) => (
                <Input
                  id="personalInfo.siblingsCount"
                  {...field}
                  type="number"
                  min="0"
                  className="mt-1 w-32"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Emergency Contacts */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-slate-800 mb-4">Emergency Contacts (at least 2)</h4>
          
          {/* First Emergency Contact */}
          <div className="mb-8">
            <h5 className="text-md font-medium text-slate-700 mb-3">Emergency Contact 1</h5>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.name">Name</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.name"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.name?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.relationship">Relationship</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.relationship"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.relationship"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.relationship?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.phoneNumber">Phone Number</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.phoneNumber"
                      {...field}
                      type="tel"
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.phoneNumber?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.email">Email</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.email"
                      {...field}
                      type="email"
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.email?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.poBox">P.O. Box</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.poBox"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.poBox"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.poBox && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.poBox?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.postalCode">Postal Code</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.postalCode"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.postalCode?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.0.town">Town</Label>
                <Controller
                  name="personalInfo.emergencyContacts.0.town"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.0.town"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[0]?.town && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[0]?.town?.message as string}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Second Emergency Contact */}
          <div>
            <h5 className="text-md font-medium text-slate-700 mb-3">Emergency Contact 2</h5>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.name">Name</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.name"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.name?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.relationship">Relationship</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.relationship"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.relationship"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.relationship?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.phoneNumber">Phone Number</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.phoneNumber"
                      {...field}
                      type="tel"
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.phoneNumber?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.email">Email</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.email"
                      {...field}
                      type="email"
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.email?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.poBox">P.O. Box</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.poBox"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.poBox"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.poBox && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.poBox?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.postalCode">Postal Code</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.postalCode"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.postalCode?.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="personalInfo.emergencyContacts.1.town">Town</Label>
                <Controller
                  name="personalInfo.emergencyContacts.1.town"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="personalInfo.emergencyContacts.1.town"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
                {errors.personalInfo?.emergencyContacts?.[1]?.town && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo?.emergencyContacts?.[1]?.town?.message as string}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
    surname: '',
    middleName: '',
    lastName: '',
    nationalIdNumber: '',
    huduma: '',
    dateOfBirth: '',
    gender: 'Male' as "Male" | "Female",
    hasDisability: false,
    disabilityDetails: '',
    nhifNumber: '',
    religion: '',
    nationality: 'Kenyan',
    contactAddress: {
      poBox: '',
      postalCode: '',
      town: '',
    },
    phoneNumber: '',
    email: '',
    maritalStatus: 'Single' as "Single" | "Married" | "Divorced" | "Widowed",
    spouseDetails: {
      name: '',
      occupation: '',
      phoneNumber: '',
      childrenCount: 0,
    },
    fatherDetails: {
      name: '',
      isAlive: true,
      occupation: '',
      dateOfBirth: '',
    },
    motherDetails: {
      name: '',
      isAlive: true,
      occupation: '',
      dateOfBirth: '',
    },
    siblingsCount: 0,
    birthPlace: '',
    permanentResidence: {
      village: '',
      nearestTown: '',
      location: '',
      chiefName: '',
      county: '',
      subCounty: '',
      constituency: '',
      nearestPoliceStation: '',
    },
    emergencyContacts: [
      {
        name: '',
        relationship: '',
        poBox: '',
        postalCode: '',
        town: '',
        phoneNumber: '',
        email: '',
      },
      {
        name: '',
        relationship: '',
        poBox: '',
        postalCode: '',
        town: '',
        phoneNumber: '',
        email: '',
      }
    ],
  },
  educationInfo: {
    secondarySchool: {
      name: '',
      indexNumber: '',
      yearCompleted: '',
      results: '',
    },
    primarySchool: {
      name: '',
      indexNumber: '',
      yearCompleted: '',
      results: '',
    },
    otherInstitutions: '',
  },
  programInfo: {
    school: '',
    programme: '',
    academicYear: '',
    campus: 'Main Campus',
    yearOfStudy: '',
    semester: '',
    entryIntake: '',
    studyMode: 'Full Time' as "Full Time" | "Weekend" | "Evening" | "Part time",
  },
  medicalInfo: {
    hospitalAdmission: {
      wasAdmitted: false,
      details: '',
    },
    medicalConditions: {
      hasTuberculosis: false,
      hasNervousDisease: false,
      hasHeartDisease: false,
      hasDigestiveDisease: false,
      hasAllergies: false,
      hasSTDs: false,
      hasPolio: false,
      otherConditions: '',
    },
    familyMedicalHistory: {
      familyTuberculosis: false,
      familyMentalIllness: false,
      familyDiabetes: false,
      familyHeartDisease: false,
    },
    immunization: {
      smallpox: {
        isImmunized: false,
        immunizationDate: '',
      },
      tetanus: {
        isImmunized: false,
        immunizationDate: '',
      },
      polio: {
        isImmunized: false,
        immunizationDate: '',
      },
    },
  },
  interests: {
    sports: '',
    clubs: '',
    additionalInfo: '',
  },
  accommodation: {
    residenceType: 'Resident' as "Resident" | "Non-resident",
    residentDetails: {
      hostelName: '',
      roomNumber: '',
    },
    nonResidentDetails: {
      residencePlace: '',
    },
  },
  documents: {
    nationalId: false,
    birthCertificate: false,
    kcpeResults: false,
    kcseResults: false,
    nhifCard: false,
    passportPhotos: false,
    acceptanceForm: false,
    medicalForm: false,
    imageConsentForm: false,
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
