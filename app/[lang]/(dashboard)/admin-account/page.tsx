import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Person } from "@/components/svg";
import { Card } from "@/components/ui/card";
const page = () => {
  return (
    <div>
      <Label
        htmlFor="circle_file_1"
        className="h-24 w-24 rounded-full flex items-center justify-center  bg-default-100"
      >
        <Input type="file" className="hidden" id="circle_file_1" />
        <Person className="text-default-400 relative right-4 cursor-pointer h-16 w-16 z-50" />
      </Label>

      <Card className="flex flex-row  !flex-nowrap justify-between items-center p-4  rounded-xl my-3">
        <div className="flex flex-col gap-3 justify-between items-start">
          <p className="font-bold text-base text-[#1A1A1A] dark:text-slate-200">
            Change Password
          </p>

          <p className="font-light text-sm text-[#1A1A1A] dark:text-slate-400">
            Create a password with at least 12 characters, including uppercase
            and lowercase letters, numbers, special characters, and avoid using
            personal information.
          </p>
        </div>
        <Button variant="outline">Change password</Button>
      </Card>
      <Card className="flex flex-row justify-between items-center p-4  rounded-xl my-3">
        <div className="flex flex-col gap-3 justify-between items-start">
          <p className="font-bold text-base text-[#1A1A1A]  dark:text-slate-200">
            Tax Number
          </p>
          <p className="font-light text-sm text-[#1A1A1A] dark:text-slate-400">
            Please enter your Tax Number (including letters and numbers, without
            spaces or special characters)
          </p>
        </div>
        <Button variant="outline">Add Tax Number</Button>
      </Card>
    </div>
  );
};

export default page;
