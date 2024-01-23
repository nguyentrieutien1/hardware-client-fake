import PulseLoader from "react-spinners/PulseLoader";

interface SpinnerProps {
  isLoading: boolean;
}
function Spinner(props: SpinnerProps) {
  const { isLoading } = props;
  return (
    isLoading && (
      <div
        style={{
          background: "#000",
          opacity: ".5",
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1000000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PulseLoader
          style={{
            zIndex: 1000,
          }}
          color="white"
          loading={isLoading}
          size={50}
        />
      </div>
    )
  );
}

export default Spinner;
