import Card from "@/components/ui/card-snippet";

import VFormWithLabel from "./vform-withlabel";
import VFormWithIcon from "./vform-withicon";

const FormLayout = () => {
  return (
    <div className="space-y-5">
      <Card title="Vertical Form With Label">
        <VFormWithLabel />
      </Card>
      {/* <Card title="Vertical Form With Icon">
        <VFormWithIcon />
      </Card> */}
    </div>
  );
};

export default FormLayout;
