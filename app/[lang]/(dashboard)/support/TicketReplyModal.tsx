"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { CreateMethod } from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";

interface TicketReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  userName: string;
  onSuccess?: () => void;
}

const TicketReplyModal = ({
  isOpen,
  onClose,
  ticketId,
  userName,
  onSuccess,
}: TicketReplyModalProps) => {
  const { t, lang } = useTranslate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error(t("Please enter a message"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await CreateMethod(`support/${ticketId}/reply`, { message }, lang);
      
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success(t("Reply sent successfully"));
        setMessage("");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(t("Failed to send reply"));
      }
    } catch (error: any) {
      console.error("Error sending reply:", error);
      toast.error(error.response?.data?.message || t("An error occurred while sending the reply"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-1.5 h-6 bg-[#ED4135] rounded-full"></div>
            {t("Reply to Ticket")}
          </DialogTitle>
          <p className="text-sm text-gray-300 mt-2">
            {t("Replying to")}: <span className="text-white font-semibold">{userName}</span> (ID: #{ticketId})
          </p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Icon icon="heroicons:chat-bubble-bottom-center-text" className="w-4 h-4 text-[#25235F]" />
              {t("Your Message")}
            </label>
            <Textarea
              placeholder={t("Type your response here...")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] resize-none border-gray-200 dark:border-gray-800 focus:ring-[#25235F] dark:focus:ring-blue-500 rounded-xl transition-all"
            />
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/90 hover:opacity-90 text-white border-0 shadow-lg shadow-red-500/20 rounded-xl transition-all font-bold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Icon icon="heroicons:paper-airplane" className="w-4 h-4 mr-1" />
                {t("Send Reply")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketReplyModal;
