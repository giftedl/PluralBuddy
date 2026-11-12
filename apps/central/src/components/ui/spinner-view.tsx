import { Spinner } from "./spinner";

export function SpinnerView() {
    return (
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 block justify-center text-center gap-2">
        <span className="w-full flex justify-center">
          <Spinner />
        </span>

        <span className="text-sm pt-2">Loading app...</span>
      </div>
    );
}