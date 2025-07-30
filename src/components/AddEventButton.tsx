function AddEventButton({ setAddingEvent }: { setAddingEvent: Function }) {
  return (
    <button
      onClick={() => {
        setAddingEvent((current: boolean) => {
          return !current;
        });
      }}
    >
      +
    </button>
  );
}

export default AddEventButton;
