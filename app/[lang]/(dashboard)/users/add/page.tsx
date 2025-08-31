"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const page = ({ onClose }: { onClose?: () => void }) => {
  const { t, loading, error } = useTranslate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    membershipPlan: "",
    membershipStatus: "Active",
    assignedTrainer: "",
    emergencyContact: "",
    emergencyPhone: "",
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
    sendWelcomeEmail: true,
    agreeToTerms: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  // Sample data for dropdowns
  const membershipPlans = [
    "Premium",
    "Standard",
    "Basic",
    "Student",
    "Corporate",
  ];
  const trainers = [
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Williams",
    "David Lee",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className=" ">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25235F]">
              Add New Member
            </h1>
            <p className="text-gray-600">
              Fill in the details below to add a new gym member
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-gray-200"
            >
              <Icon icon="heroicons:x-mark" className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              Member Information
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:user-plus"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon icon="heroicons:user" className="h-5 w-5 inline mr-2" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-[#25235F] font-medium"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter first name"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[#25235F] font-medium"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter last name"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#25235F] font-medium"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="member@example.com"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[#25235F] font-medium"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="birthDate"
                      className="text-[#25235F] font-medium"
                    >
                      Date of Birth
                    </Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#25235F] font-medium">Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer">
                          Female
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="cursor-pointer">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-[#25235F] font-medium"
                  >
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>
              </div>

              {/* Membership Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:identification"
                    className="h-5 w-5 inline mr-2"
                  />
                  Membership Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="membershipPlan"
                      className="text-[#25235F] font-medium"
                    >
                      Membership Plan *
                    </Label>
                    <Select
                      value={formData.membershipPlan}
                      onValueChange={(value) =>
                        handleSelectChange("membershipPlan", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {membershipPlans.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="text-[#25235F] font-medium"
                    >
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="assignedTrainer"
                      className="text-[#25235F] font-medium"
                    >
                      Assigned Trainer
                    </Label>
                    <Select
                      value={formData.assignedTrainer}
                      onValueChange={(value) =>
                        handleSelectChange("assignedTrainer", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer} value={trainer}>
                            {trainer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="membershipStatus"
                      className="text-[#25235F] font-medium"
                    >
                      Membership Status
                    </Label>
                    <Select
                      value={formData.membershipStatus}
                      onValueChange={(value) =>
                        handleSelectChange("membershipStatus", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Frozen">Frozen</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:phone"
                    className="h-5 w-5 inline mr-2"
                  />
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="emergencyContact"
                      className="text-[#25235F] font-medium"
                    >
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="emergencyPhone"
                      className="text-[#25235F] font-medium"
                    >
                      Emergency Phone Number
                    </Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:clipboard-document"
                    className="h-5 w-5 inline mr-2"
                  />
                  Additional Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#25235F] font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information about this member"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[100px]"
                  />
                </div>

                <div className="flex items-center justify-between space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("sendWelcomeEmail", checked)
                      }
                    />
                    <Label
                      htmlFor="sendWelcomeEmail"
                      className="cursor-pointer"
                    >
                      Send welcome email
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("agreeToTerms", checked)
                      }
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="cursor-pointer">
                      I agree to terms and conditions *
                    </Label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/90 hover:from-[#ED4135]/90 hover:to-[#ED4135] text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icon icon="heroicons:user-plus" className="h-5 w-5 mr-2" />
                  Create Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
