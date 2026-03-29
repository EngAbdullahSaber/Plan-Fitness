"use client"
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatchMethodWithBody } from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  chest: z.string().min(1, "Chest measurement is required"),
  tricep: z.string().min(1, "Tricep measurement is required"),
  buttock: z.string().min(1, "Buttock measurement is required"),
  bully: z.string().min(1, "Belly/Bully measurement is required"),
  thigh: z.string().min(1, "Thigh measurement is required"),
  waist: z.string().min(1, "Waist measurement is required"),
  goal: z.string().min(1, "Goal is required"),
});

interface UpdateUserMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  t: any;
}

const UpdateUserMeasurementsModal: React.FC<UpdateUserMeasurementsModalProps> = ({
  isOpen,
  onClose,
  user,
  t,
}) => {
  const { lang } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const goalOptions = [
    { value: "increase fitness", label: t("increase_fitness") || "Increase fitness", icon: "lucide:trending-up" },
    { value: "Lose weight", label: t("lose_weight") || "Lose weight", icon: "lucide:weight" },
    { value: "shredding", label: t("shredding") || "Shredding", icon: "lucide:flame" },
    { value: "general fitness", label: t("general_fitness") || "General fitness", icon: "lucide:heart-pulse" },
    { value: "gain weight", label: t("gain_weight") || "Gain weight", icon: "lucide:dumbbell" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "",
      chest: "",
      tricep: "",
      buttock: "",
      bully: "",
      thigh: "",
      waist: "",
      goal: "",
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        weight: user.Weight || user.weight || "",
        chest: user.chest || "",
        tricep: user.tricep || "",
        buttock: user.buttock || "",
        bully: user.bully || "",
        thigh: user.thigh || "",
        waist: user.waist || "",
        goal: user.goal || "",
      });
    }
  }, [user, isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        userId: user.id,
      };

      const response = await PatchMethodWithBody(
        "user",
        "admin/user-measurements",
        payload,
        lang
      );

      if (response && (response.status === 200 || response.code === 200)) {
        toast.success(t("measurements_updated_successfully") || "Measurements updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onClose();
      } else {
        toast.error(response?.message || t("failed_to_update_measurements") || "Failed to update measurements");
      }
    } catch (error: any) {
      console.error("Error updating measurements:", error);
      toast.error(error.response?.data?.message || error.message || t("an_error_occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl">
    <ScrollArea>
          {/* Premium Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#25235F] to-[#3a378c] px-6 py-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#ED4135]/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              <Icon icon="heroicons:clipboard-document-list" className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {t("update_user_measurements") || "Update User Measurements"}
              </DialogTitle>
              <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
                <Icon icon="heroicons:user-circle" className="w-4 h-4" />
                {t("updating_measurements_for") || "Updating for"}: <span className="font-semibold text-white">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Goal Section */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-700 pb-3">
                  <Icon icon="heroicons:sparkles" className="w-5 h-5 text-[#ED4135]" />
                  <h3 className="font-bold text-[#25235F] dark:text-white uppercase tracking-wider text-xs">{t("strategy_goal") || "Strategy & Goal"}</h3>
                </div>
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-semibold text-gray-500">{t("current_goal") || "Current Goal"}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl focus:ring-[#25235F]">
                            <SelectValue placeholder={t("select_goal") || "Select goal"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[10001] rounded-xl border-gray-100 shadow-2xl">
                          {goalOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="rounded-lg py-2.5">
                              <div className="flex items-center gap-3">
                                <Icon icon={option.icon} className="w-5 h-5 text-[#25235F] dark:text-[#ED4135]" />
                                <span className="font-medium">{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Measurements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Card */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-700 pb-3">
                    <Icon icon="mdi:weight-lifter" className="w-5 h-5 text-[#ED4135] transition-transform group-hover:scale-110" />
                    <h3 className="font-bold text-[#25235F] dark:text-white uppercase tracking-wider text-xs">{t("core_metrics") || "Core Metrics"}</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-gray-500">{t("weight") || "Weight"} (kg)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="75.5" {...field} className="h-12 pl-10 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl focus:ring-[#25235F]" />
                            <Icon icon="lucide:scale" className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Body Stats Card */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md group">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-700 pb-3">
                    <Icon icon="mdi:ruler-square" className="w-5 h-5 text-[#ED4135] transition-transform group-hover:scale-110" />
                    <h3 className="font-bold text-[#25235F] dark:text-white uppercase tracking-wider text-xs">{t("body_stats") || "Body Stats"}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "chest", label: "Chest", icon: "lucide:ruler" },
                      { name: "tricep", label: "Tricep", icon: "lucide:ruler" },
                      { name: "buttock", label: "Buttock", icon: "lucide:ruler" },
                      { name: "bully", label: "Belly", icon: "lucide:ruler" },
                      { name: "thigh", label: "Thigh", icon: "lucide:ruler" },
                      { name: "waist", label: "Waist", icon: "lucide:ruler" },
                    ].map((m) => (
                      <FormField
                        key={m.name}
                        control={form.control}
                        name={m.name as any}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t(m.name) || m.label} (cm)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input placeholder="90" {...field} className="h-10 pl-9 text-sm border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl focus:ring-[#25235F]" />
                                <Icon icon={m.icon} className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose} 
                  disabled={isSubmitting}
                  className="rounded-xl px-6 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  {t("cancel") || "Cancel"}
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#25235F] hover:bg-[#1e1c4d] text-white rounded-xl px-8 h-12 shadow-lg shadow-[#25235F]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t("saving") || "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:check-circle" className="w-5 h-5" />
                      <span>{t("update_measurements") || "Update Measurements"}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
    </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserMeasurementsModal;
