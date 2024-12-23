/* eslint-disable react/prop-types */
const GenderCheckbox = ({ gender, setGender }) => {
  return (
    <div className="flex">
      <div className="form-control">
        <label className="label gap-2 cursor-pointer">
          <span className="label-text text-black">Male</span>
          <input
            type="checkbox"
            checked={gender === "male"}
            className="checkbox border-slate-600"
            onChange={() => setGender("male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label gap-2 cursor-pointer">
          <span className="label-text text-black">Female</span>
          <input
            type="checkbox"
            checked={gender === "female"}
            className="checkbox border-slate-600"
            onChange={() => setGender("female")}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
