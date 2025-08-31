import Card from "@/components/ui/card-snippet";
import BasicFormWizard from "./basic-wizard";

const FormLayout = () => {
  return (
    <div className="space-y-4">
      <Card title="Basic">
        <BasicFormWizard />
      </Card>
    </div>
  );
};

export default FormLayout;
