"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from "@iconify/react";
import ActivityTimeline from "./activity-timeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";

const Activity = () => {
  const { t, loading, error } = useTranslate();

  return (
    <Card className="mt-6">
      <CardHeader className="flex-row flex-wrap items-center gap-4 border-none mb-0">
        <CardTitle className="flex-1 text-2xl font-medium text-default-900 whitespace-nowrap">
          Recent Activity
        </CardTitle>
        <InputGroup merged className="flex-none max-w-[210px]">
          <InputGroupText>
            <Icon icon="heroicons:magnifying-glass" />
          </InputGroupText>
          <Input type="text" placeholder={t("Search")} />
        </InputGroup>
      </CardHeader>
      <CardContent>
        <ActivityTimeline />
        <div className="flex justify-center mt-9">
          <Button color="secondary">
            <Plus className="h-4 w-4 ltr:mr-1 rtl:ml-1" /> Load More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Activity;
