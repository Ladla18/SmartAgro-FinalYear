export const useToast = () => {
  return (
    <span>
      Custom and <b>bold</b>
      <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
    </span>
  );
};
