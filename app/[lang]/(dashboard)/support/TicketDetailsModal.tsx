"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { GetSpecifiedMethod } from "@/app/services/apis/ApiMethod";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Reply {
  id: number;
  message: string;
  createdAt: string;
  isAdmin: boolean;
}

interface DetailedTicket {
  id: number;
  message: string;
  createdAt: string;
  status: string;
  user: {
    name: string;
  };
  replies: Reply[];
}

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
}

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticketId,
}: TicketDetailsModalProps) => {
  const { t, lang } = useTranslate();
  const [ticket, setTicket] = useState<DetailedTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && ticketId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await GetSpecifiedMethod(`support/${ticketId}`, lang);
          if (response && response.data && response.data.data) {
            setTicket(response.data.data);
          } else if (response && response.data) {
            setTicket(response.data);
          }
        } catch (error) {
          console.error("Error fetching ticket details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, ticketId, lang]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-950 rounded-2xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-1.5 h-6 bg-[#ED4135] rounded-full"></div>
            {t("Ticket Details")} - #{ticketId}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-300">
              {t("Status")}: 
            </span>
            {loading ? (
              <Skeleton className="h-4 w-16 bg-white/20" />
            ) : (
              <span className="bg-[#ED4135] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {ticket?.status}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-2 max-w-[80%]",
                    i % 2 === 0 ? "ml-auto" : "mr-auto"
                  )}
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Original Message */}
              <div className="flex flex-col gap-2 mr-auto max-w-[90%] group">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="text-[#25235F] font-bold">
                    {ticket?.user?.name || t("User")}
                  </span>
                  <span>•</span>
                  <span>{new Date(ticket?.createdAt || "").toLocaleString()}</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                  <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                    {ticket?.message}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {ticket?.replies?.map((reply, index) => (
                <div
                  key={reply.id}
                  className={cn(
                    "flex flex-col gap-2 max-w-[90%] group animate-in slide-in-from-bottom-2 duration-300",
                    reply.isAdmin ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs font-medium text-gray-500",
                      reply.isAdmin ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className={cn(
                      "font-bold",
                      reply.isAdmin ? "text-[#ED4135]" : "text-[#25235F]"
                    )}>
                      {reply.isAdmin ? t("Admin") : ticket.user.name}
                    </span>
                    <span>•</span>
                    <span>{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-2xl shadow-sm transition-all hover:shadow-md border",
                      reply.isAdmin
                        ? "bg-gradient-to-br from-[#25235F] to-indigo-800 text-white rounded-tr-none border-indigo-700"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {reply.message}
                    </p>
                  </div>
                </div>
              ))}

              {!ticket?.replies?.length && (
                <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                  <Icon icon="heroicons:chat-bubble-left" className="w-10 h-10" />
                  <p className="text-sm italic">{t("No replies yet")}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800 text-center">
          <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
            {t("Ticket Lifecycle History")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;
