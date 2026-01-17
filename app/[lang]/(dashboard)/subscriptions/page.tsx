"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import { useTranslate } from "@/config/useTranslation";
import { toast } from "react-hot-toast";
import {
  GetSpecifiedMethod,
  UpdateMethod,
  CreateMethodFormData,
  GetMethod,
} from "@/app/services/apis/ApiMethod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionFeature {
  id?: number;
  description: string | { arabic: string; english: string };
}

interface Subscription {
  id: number;
  name: string | { ar: string; en: string };
  type: "DEFAULT" | "WITH_COACH";
  duration: "MONTH" | "THREE_MONTH" | "ONE_YEAR";
  price: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptionFeatures: SubscriptionFeature[];
}

interface SubscriptionsData {
  default: Subscription[];
  with_coach: Subscription[];
}

interface UpdateSubscriptionFormData {
  name: {
    arabic: string;
    english: string;
  };
  type: "DEFAULT" | "WITH_COACH";
  duration: "MONTH" | "THREE_MONTH" | "ONE_YEAR";
  price: number;
  features: Array<{
    description: {
      arabic: string;
      english: string;
    };
  }>;
}

const SubscriptionsPage = () => {
  const { t, lang } = useTranslate();
  const [activeTab, setActiveTab] = useState("default");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionsData | null>(
    null,
  );
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateSubscriptionFormData>({
    name: { arabic: "", english: "" },
    type: "DEFAULT",
    duration: "MONTH",
    price: 0,
    features: [{ description: { arabic: "", english: "" } }],
  });

  // Helper function for toast messages
  const showToast = {
    success: (message: string) => toast.success(t(message) || message),
    error: (message: string) => toast.error(t(message) || message),
    loading: (message: string) => toast.loading(t(message) || message),
  };

  // Fetch subscriptions data
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await GetMethod("/subscription", lang);
      if (response.data.data) {
        setSubscriptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      showToast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [lang]);

  // Handle edit subscription
  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);

    // Parse subscription name (could be string or object)
    let nameArabic = "";
    let nameEnglish = "";
    if (typeof subscription.name === "object") {
      nameArabic = subscription.name.arabic || "";
      nameEnglish = subscription.name.english || "";
    } else {
      nameEnglish = subscription.name;
    }

    // Parse features
    const features = subscription.subscriptionFeatures.map((feature) => {
      if (typeof feature.description === "object") {
        return {
          description: {
            arabic: feature.description.arabic || "",
            english: feature.description.english || "",
          },
        };
      } else {
        return {
          description: {
            arabic: feature.description,
            english: feature.description,
          },
        };
      }
    });

    setFormData({
      name: {
        arabic: nameArabic,
        english: nameEnglish,
      },
      type: subscription.type,
      duration: subscription.duration,
      price: subscription.price,
      features:
        features.length > 0
          ? features
          : [{ description: { arabic: "", english: "" } }],
    });

    setIsEditDialogOpen(true);
  };

  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle feature change
  const handleFeatureChange = (
    index: number,
    field: "arabic" | "english",
    value: string,
  ) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      description: {
        ...updatedFeatures[index].description,
        [field]: value,
      },
    };
    handleInputChange("features", updatedFeatures);
  };

  // Add new feature field
  const addFeatureField = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { description: { arabic: "", english: "" } },
      ],
    }));
  };

  // Remove feature field
  const removeFeatureField = (index: number) => {
    if (formData.features.length > 1) {
      const updatedFeatures = [...formData.features];
      updatedFeatures.splice(index, 1);
      handleInputChange("features", updatedFeatures);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!editingSubscription) return;

    setUploading(true);
    try {
      const response = await UpdateMethod(
        "/subscription",
        formData,
        editingSubscription.id,
        lang,
      );

      if (response?.code === 200) {
        showToast.success("Subscription updated successfully");
        setIsEditDialogOpen(false);
        fetchSubscriptions(); // Refresh data
      }
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update subscription";
      showToast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Get duration label
  const getDurationLabel = (duration: string) => {
    const labels: Record<string, string> = {
      MONTH: t("Monthly"),
      THREE_MONTH: t("Quarterly"),
      ONE_YEAR: t("Annual"),
    };
    return labels[duration] || duration;
  };

  // Get subscription type label
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DEFAULT: "Basic Plan",
      WITH_COACH: "Premium Plan",
    };
    return labels[type] || type;
  };

  // Render subscription card
  const renderSubscriptionCard = (
    subscription: Subscription,
    type: "default" | "with_coach",
  ) => {
    const name =
      typeof subscription.name === "object"
        ? lang === "ar"
          ? subscription.name.ar
          : subscription.name.en
        : subscription.name;

    const isPremium = type === "with_coach";

    return (
      <Card
        key={subscription.id}
        className={`overflow-hidden border-2 ${isPremium ? "border-orange-500" : "border-blue-500"}`}
      >
        <CardHeader
          className={`${isPremium ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"} text-white`}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">{name}</CardTitle>
            <Badge variant="secondary" className="font-semibold">
              {getDurationLabel(subscription.duration)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">
                {formatPrice(subscription.price)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={isPremium ? "default" : "outline"}
                className={
                  isPremium
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {getTypeLabel(subscription.type)}
              </Badge>
              {subscription.isDefault && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Default
                </Badge>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">{t("Features")}:</h4>
              <ul className="space-y-2">
                {subscription.subscriptionFeatures.map((feature, index) => {
                  const description =
                    typeof feature.description === "object"
                      ? lang === "ar"
                        ? feature.description.arabic
                        : feature.description.english
                      : feature.description;

                  return (
                    <li
                      key={feature.id || index}
                      className="flex items-start gap-2"
                    >
                      <Icon
                        icon="mdi:check-circle"
                        className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">{description}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {t("Updated")}:{" "}
                  {new Date(subscription.updatedAt).toLocaleDateString()}
                </span>
                <span>
                  {t("ID")}: {subscription.id}
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleEditSubscription(subscription)}
              variant="outline"
              className="w-full mt-4"
            >
              <Icon icon="mdi:pencil" className="h-4 w-4 mr-2" />
              {t("Edit Subscription")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-600 rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("SUBSCRIPTIONS") || "SUBSCRIPTIONS"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mt-2">
                {t("Manage subscription plans") || "Manage subscription plans"}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <BreadcrumbComponent
              header={t("Settings") || "Settings"}
              body={t("Subscriptions") || "Subscriptions"}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 dark:from-blue-600 dark:via-cyan-600 dark:to-blue-600 relative overflow-hidden pb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <CardTitle className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                  <Icon icon="mdi:crown" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide">
                    {(
                      t("SUBSCRIPTION PLANS") || "SUBSCRIPTION PLANS"
                    ).toUpperCase()}
                  </h2>
                  <p className="text-blue-100 text-sm font-medium">
                    {t("Manage and update subscription plans") ||
                      "Manage and update subscription plans"}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-semibold">
                  {loading ? t("Loading...") : t("Active")}
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              {/* Custom Tabs List */}
              <TabsList className="grid grid-cols-2 w-full bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 h-auto">
                <TabsTrigger
                  value="default"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-cyan-600 rounded-lg py-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:dumbbell" className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-base">
                        {t("Basic Plans") || "Basic Plans"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {t("Default subscriptions") || "Default subscriptions"}
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="with_coach"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-red-600 rounded-lg py-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:account-tie" className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-base">
                        {t("Premium Plans") || "Premium Plans"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {t("With coach support") || "With coach support"}
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Icon
                    icon="mdi:loading"
                    className="h-12 w-12 animate-spin text-blue-500"
                  />
                </div>
              )}

              {/* Basic Plans Tab */}
              <TabsContent value="default" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptions?.default?.map((subscription) =>
                    renderSubscriptionCard(subscription, "default"),
                  )}
                </div>
              </TabsContent>

              {/* Premium Plans Tab */}
              <TabsContent value="with_coach" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptions?.with_coach?.map((subscription) =>
                    renderSubscriptionCard(subscription, "with_coach"),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Subscription Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {t("Edit Subscription")}
              </DialogTitle>
              <DialogDescription>
                {t("Update subscription details and features")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-arabic">{t("Name")} (Arabic)</Label>
                  <Input
                    id="name-arabic"
                    value={formData.name.arabic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: { ...prev.name, arabic: e.target.value },
                      }))
                    }
                    placeholder="اسم الاشتراك"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-english">{t("Name")} (English)</Label>
                  <Input
                    id="name-english"
                    value={formData.name.english}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: { ...prev.name, english: e.target.value },
                      }))
                    }
                    placeholder="Subscription Name"
                  />
                </div>
              </div>

              {/* Type and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("Type")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "DEFAULT" | "WITH_COACH") =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFAULT">{t("Basic Plan")}</SelectItem>
                      <SelectItem value="WITH_COACH">
                        {t("Premium Plan")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">{t("Duration")}</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(
                      value: "MONTH" | "THREE_MONTH" | "ONE_YEAR",
                    ) => handleInputChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTH">{t("Monthly")}</SelectItem>
                      <SelectItem value="THREE_MONTH">
                        {t("Quarterly")}
                      </SelectItem>
                      <SelectItem value="ONE_YEAR">{t("Annual")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">{t("Price")} ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">
                    {t("Features")}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeatureField}
                  >
                    <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
                    {t("Add Feature")}
                  </Button>
                </div>

                {formData.features.map((feature, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {t("Feature")} #{index + 1}
                      </span>
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeatureField(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon icon="mdi:trash" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`feature-arabic-${index}`}>
                          Arabic Description
                        </Label>
                        <Textarea
                          id={`feature-arabic-${index}`}
                          value={feature.description.arabic}
                          onChange={(e) =>
                            handleFeatureChange(index, "arabic", e.target.value)
                          }
                          placeholder="وصف الميزة بالعربية"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`feature-english-${index}`}>
                          {t("English Description")}
                        </Label>
                        <Textarea
                          id={`feature-english-${index}`}
                          value={feature.description.english}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              "english",
                              e.target.value,
                            )
                          }
                          placeholder="Feature description in English"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={uploading}
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {uploading ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    {t("Updating...")}
                  </>
                ) : (
                  t("Update Subscription")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
