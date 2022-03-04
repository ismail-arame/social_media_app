export default function InputSearchUsers({
  handleChange,
  searchedUserQuery,
  isClickedOutsideCardlist,
  setClickedOutsideCardlist,
  setFocusOnInput,
}) {
  return (
    <div className="h-9 w-[268px] relative">
      <input
        aria-label="search for a user"
        type="search"
        value={searchedUserQuery}
        placeholder="Search..."
        onChange={e => {
          handleChange(e);

          //when i click on the x button on the input (because javascript consider it not focus ) so isClickedOutsideCardlist will be true so we have to make it false again using onChange
          if (!isClickedOutsideCardlist) {
            setClickedOutsideCardlist(false);
          }
        }}
        onFocus={() => {
          setFocusOnInput(true);
          setClickedOutsideCardlist(false);
          console.log('nice');
        }}
        onBlur={() => {
          //detecting when the user Loses Input Focus (clicks outside the Input)

          //only when the user clicks outside the cardlist wrapper we wanna hide the cardlist wrapper
          if (isClickedOutsideCardlist) {
            setFocusOnInput(false);
          }
        }}
        className="border-0 text-base text-black-light rounded bg-gray-search px-4 py-1 focus:outline-none h-full w-full "
      />
    </div>
  );
}
