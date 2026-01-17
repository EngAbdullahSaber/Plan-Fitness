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
  UpdateMethodFormData,
  CreateMethodFormData,
} from "@/app/services/apis/ApiMethod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const { t, lang } = useTranslate();
  const [activeTab, setActiveTab] = useState("privacy-policy");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [privacyPolicyFile, setPrivacyPolicyFile] = useState<File | null>(null);
  const [termsFile, setTermsFile] = useState<File | null>(null);
  const [privacyPolicyData, setPrivacyPolicyData] = useState<any>(null);
  const [termsData, setTermsData] = useState<any>(null);

  // Helper function for toast messages with better error handling
  const showToast = {
    success: (message: string) => toast.success(t(message) || message),
    error: (message: string) => toast.error(t(message) || message),
    loading: (message: string) => toast.loading(t(message) || message),
  };

  // Fetch existing data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch privacy policy
      const privacyRes = await GetSpecifiedMethod(
        "/static-content/privacy-policy",
        lang,
      );
      if (privacyRes?.data) {
        setPrivacyPolicyData(privacyRes.data);
      }

      // Fetch terms and conditions
      const termsRes = await GetSpecifiedMethod(
        "/static-content/terms-and-conditions",
        lang,
      );
      if (termsRes?.data) {
        setTermsData(termsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Try different translation keys
      const errorMessage =
        t("Failed to load data") || t("failed") || "Failed to load data";
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang]);

  const handleFileChange = (type: "privacy" | "terms", file: File | null) => {
    if (type === "privacy") {
      setPrivacyPolicyFile(file);
    } else {
      setTermsFile(file);
    }
  };

  const handleUpload = async (type: "privacy" | "terms") => {
    const file = type === "privacy" ? privacyPolicyFile : termsFile;
    const contentType =
      type === "privacy" ? "privacy-policy" : "terms-and-conditions";
    const existingData = type === "privacy" ? privacyPolicyData : termsData;

    if (!file) {
      // Try different translation keys
      const errorMessage =
        t("Please select a file to upload") ||
        t("select_file") ||
        "Please select a file to upload";
      showToast.error(errorMessage);
      return;
    }

    // Check file type
    if (file.type !== "application/pdf") {
      const errorMessage =
        t("Only PDF files are allowed") ||
        t("pdf_only") ||
        "Only PDF files are allowed";
      showToast.error(errorMessage);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentType", contentType);

      let response;

      if (existingData?.id) {
        // Update existing
        response = await UpdateMethodFormData(
          "/static-content",
          formData,
          existingData.id,
          lang,
        );
        const successMessage =
          type === "privacy"
            ? t("Privacy Policy updated successfully") ||
              "Privacy Policy updated successfully"
            : t("Terms and Conditions updated successfully") ||
              "Terms and Conditions updated successfully";
        showToast.success(successMessage);
      } else {
        // Create new
        response = await CreateMethodFormData(
          "/static-content",
          formData,
          lang,
        );
        const successMessage =
          type === "privacy"
            ? t("Privacy Policy uploaded successfully") ||
              "Privacy Policy uploaded successfully"
            : t("Terms and Conditions uploaded successfully") ||
              "Terms and Conditions uploaded successfully";
        showToast.success(successMessage);
      }

      // Refresh data
      fetchData();

      // Clear file input
      if (type === "privacy") {
        setPrivacyPolicyFile(null);
        const fileInput = document.getElementById(
          "privacy-file",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setTermsFile(null);
        const fileInput = document.getElementById(
          "terms-file",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message || t("Upload failed") || "Upload failed";
      showToast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-orange-500 via-red-500 to-orange-600 rounded-full" />
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("SETTINGS") || "SETTINGS"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mt-2">
                {t("Static Content Management") || "Static Content Management"}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <BreadcrumbComponent
              header={t("Settings") || "Settings"}
              body={t("Static Content") || "Static Content"}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 dark:from-orange-600 dark:via-red-600 dark:to-orange-600 relative overflow-hidden pb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <CardTitle className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                  <Icon icon="mdi:dumbbell" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide">
                    {(t("LEGAL DOCUMENTS") || "LEGAL DOCUMENTS").toUpperCase()}
                  </h2>
                  <p className="text-orange-100 text-sm font-medium">
                    {t("Manage your privacy and terms") ||
                      "Manage your privacy and terms"}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-semibold">
                  {t("Active") || "Active"}
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              {/* Custom Tabs List */}
              <TabsList className="grid grid-cols-2 w-full bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 h-auto">
                <TabsTrigger
                  value="privacy-policy"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-red-600 rounded-lg py-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:shield-lock" className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-base">
                        {t("Privacy Policy") || "Privacy Policy"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {t("Security & Privacy") || "Security & Privacy"}
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-red-600 rounded-lg py-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:file-document-outline"
                      className="h-5 w-5"
                    />
                    <div className="text-left">
                      <div className="font-bold text-base">
                        {t("Terms & Conditions") || "Terms & Conditions"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {t("Legal Agreement") || "Legal Agreement"}
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Privacy Policy Tab */}
              <TabsContent value="privacy-policy" className="space-y-6">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 md:p-8 rounded-2xl border-2 border-orange-200 dark:border-orange-500/30 shadow-lg">
                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl flex items-center justify-center">
                          <Icon
                            icon="mdi:shield-lock"
                            className="h-6 w-6 text-white"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                            {(
                              t("PRIVACY POLICY") || "PRIVACY POLICY"
                            ).toUpperCase()}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {t("Protect your users' data") ||
                              "Protect your users' data"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Current File Info */}
                    {privacyPolicyData && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0">
                              <Icon
                                icon="mdi:file-pdf-box"
                                className="h-7 w-7 text-white"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                                {privacyPolicyData.originalName ||
                                  "privacy-policy.pdf"}
                              </h4>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() =>
                              handleDownload(
                                privacyPolicyData.fileUrl,
                                `privacy-policy-${
                                  new Date().toISOString().split("T")[0]
                                }.pdf`,
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-orange-300 dark:border-orange-500/50 text-slate-900 dark:text-white hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-600 dark:hover:border-orange-600 font-bold transition-all duration-300"
                          >
                            <Icon
                              icon="mdi:download"
                              className="h-5 w-5 mr-2"
                            />
                            {t("DOWNLOAD") || "DOWNLOAD"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Upload Section */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-orange-300 dark:border-orange-500/50 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group">
                        <Input
                          type="file"
                          id="privacy-file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleFileChange(
                              "privacy",
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                        <Label
                          htmlFor="privacy-file"
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Icon
                                icon="mdi:cloud-upload"
                                className="h-10 w-10 text-white"
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-lg mb-1">
                                {privacyPolicyFile
                                  ? privacyPolicyFile.name
                                  : t("UPLOAD PDF FILE") || "UPLOAD PDF FILE"}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {t("Click to browse or drag and drop") ||
                                  "Click to browse or drag and drop"}
                              </p>
                              <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 font-semibold">
                                {t("PDF files only • Max 10MB") ||
                                  "PDF files only • Max 10MB"}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <Button
                        onClick={() => handleUpload("privacy")}
                        disabled={!privacyPolicyFile || uploading}
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 dark:from-orange-600 dark:via-red-600 dark:to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 dark:hover:from-orange-700 dark:hover:via-red-700 dark:hover:to-orange-700 text-white font-black text-lg py-6 rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <Icon
                              icon="mdi:loading"
                              className="h-6 w-6 mr-3 animate-spin"
                            />
                            {t("UPLOADING...") || "UPLOADING..."}
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:upload" className="h-6 w-6 mr-3" />
                            {privacyPolicyData
                              ? t("UPDATE PRIVACY POLICY") ||
                                "UPDATE PRIVACY POLICY"
                              : t("UPLOAD PRIVACY POLICY") ||
                                "UPLOAD PRIVACY POLICY"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Terms & Conditions Tab */}
              <TabsContent value="terms" className="space-y-6">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 md:p-8 rounded-2xl border-2 border-orange-200 dark:border-orange-500/30 shadow-lg">
                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl flex items-center justify-center">
                          <Icon
                            icon="mdi:file-document-outline"
                            className="h-6 w-6 text-white"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                            {(
                              t("TERMS & CONDITIONS") || "TERMS & CONDITIONS"
                            ).toUpperCase()}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">
                            {t("Define usage agreements") ||
                              "Define usage agreements"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Current File Info */}
                    {termsData && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 flex items-center justify-center flex-shrink-0">
                              <Icon
                                icon="mdi:file-pdf-box"
                                className="h-7 w-7 text-white"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                                {termsData.originalName ||
                                  "terms-and-conditions.pdf"}
                              </h4>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() =>
                              handleDownload(
                                termsData.fileUrl,
                                `terms-and-conditions-${
                                  new Date().toISOString().split("T")[0]
                                }.pdf`,
                              )
                            }
                            className="bg-white dark:bg-slate-800 border-orange-300 dark:border-orange-500/50 text-slate-900 dark:text-white hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-600 dark:hover:border-orange-600 font-bold transition-all duration-300"
                          >
                            <Icon
                              icon="mdi:download"
                              className="h-5 w-5 mr-2"
                            />
                            {t("DOWNLOAD") || "DOWNLOAD"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Upload Section */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-orange-300 dark:border-orange-500/50 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group">
                        <Input
                          type="file"
                          id="terms-file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleFileChange(
                              "terms",
                              e.target.files?.[0] || null,
                            )
                          }
                          className="hidden"
                        />
                        <Label htmlFor="terms-file" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Icon
                                icon="mdi:cloud-upload"
                                className="h-10 w-10 text-white"
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-lg mb-1">
                                {termsFile
                                  ? termsFile.name
                                  : t("UPLOAD PDF FILE") || "UPLOAD PDF FILE"}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {t("Click to browse or drag and drop") ||
                                  "Click to browse or drag and drop"}
                              </p>
                              <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 font-semibold">
                                {t("PDF files only • Max 10MB") ||
                                  "PDF files only • Max 10MB"}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <Button
                        onClick={() => handleUpload("terms")}
                        disabled={!termsFile || uploading}
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 dark:from-orange-600 dark:via-red-600 dark:to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 dark:hover:from-orange-700 dark:hover:via-red-700 dark:hover:to-orange-700 text-white font-black text-lg py-6 rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <Icon
                              icon="mdi:loading"
                              className="h-6 w-6 mr-3 animate-spin"
                            />
                            {t("UPLOADING...") || "UPLOADING..."}
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:upload" className="h-6 w-6 mr-3" />
                            {termsData
                              ? t("UPDATE TERMS & CONDITIONS") ||
                                "UPDATE TERMS & CONDITIONS"
                              : t("UPLOAD TERMS & CONDITIONS") ||
                                "UPLOAD TERMS & CONDITIONS"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-center">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Icon
              icon="mdi:shield-check"
              className="h-5 w-5 text-orange-500 dark:text-orange-500"
            />
            <span className="text-sm font-medium">
              {t("Secure & Encrypted") || "Secure & Encrypted"}
            </span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Icon
              icon="mdi:lightning-bolt"
              className="h-5 w-5 text-orange-500 dark:text-orange-500"
            />
            <span className="text-sm font-medium">
              {t("Instant Updates") || "Instant Updates"}
            </span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Icon
              icon="mdi:cloud-check"
              className="h-5 w-5 text-orange-500 dark:text-orange-500"
            />
            <span className="text-sm font-medium">
              {t("Cloud Storage") || "Cloud Storage"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
