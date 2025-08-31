import Select from "react-select";
const furits: { value: string; label: string }[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const BasicSelect = () => {
  return (
    <div>
      <Select
        className="react-select"
        classNamePrefix="select"
        defaultValue={furits[1]}
        styles={styles}
        name="clear"
        options={furits}
        isClearable
      />
    </div>
  );
};

export default BasicSelect;
