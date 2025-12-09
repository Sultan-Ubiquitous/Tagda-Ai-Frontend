import { StepItemProps, StepType } from "@/types";

export const StepItem = ({ step, onToggle }: StepItemProps) => {
  const isDone = step.status === "completed";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left px-3 py-2 flex items-start gap-2 text-xs hover:bg-gray-50"
    >
      <div
        className={[
          "mt-0.5 h-3 w-3 border border-black rounded-sm shrink-0",
          isDone ? "bg-black" : "",
        ].join(" ")}
      />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-medium">
            {step.type === StepType.CreateFile ? "Create file" : "Run script"}
          </span>
          <span className="text-[10px] text-gray-500">
            {isDone ? "Completed" : "Pending"}
          </span>
        </div>
        {step.path && (
          <div className="font-mono text-[11px] mb-0.5">
            {step.path}
          </div>
        )}
        <div className="text-[11px] text-gray-600 line-clamp-2">
          {step.description}
        </div>
      </div>
    </button>
  );
};